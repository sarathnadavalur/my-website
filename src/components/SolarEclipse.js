import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import "../styles/SolarEclipse.css";

// ---- small math helpers -------------------------------------------------

const TAU = Math.PI * 2;

// wraps an angle into (-PI, PI]
function wrapAngle(a) {
  return a - TAU * Math.floor((a + Math.PI) / TAU);
}

// 0..1 bump centered on `center`, `sharpness` controls how narrow the peak is
function angularPeak(angle, center, sharpness) {
  return Math.pow(Math.max(0, Math.cos(wrapAngle(angle - center))), sharpness);
}

// exponential ease toward `target`, frame-rate independent
function approach(current, target, dt, speed) {
  return current + (target - current) * (1 - Math.exp(-dt * speed));
}

// ---- procedural textures (no external image assets needed) -------------

function makeCanvas(size) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  return canvas;
}

function makeRadialTexture(stops, size = 256) {
  const canvas = makeCanvas(size);
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  stops.forEach(({ offset, color }) => gradient.addColorStop(offset, color));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function makeFlareTexture(size = 256) {
  const canvas = makeCanvas(size);
  const ctx = canvas.getContext("2d");
  const c = size / 2;
  ctx.globalCompositeOperation = "lighter";

  const core = ctx.createRadialGradient(c, c, 0, c, c, size * 0.14);
  core.addColorStop(0, "rgba(255,255,255,1)");
  core.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = core;
  ctx.fillRect(0, 0, size, size);

  [0, Math.PI / 2].forEach((rot) => {
    ctx.save();
    ctx.translate(c, c);
    ctx.rotate(rot);
    const beam = ctx.createLinearGradient(-c, 0, c, 0);
    beam.addColorStop(0, "rgba(255,220,150,0)");
    beam.addColorStop(0.5, "rgba(255,240,200,0.9)");
    beam.addColorStop(1, "rgba(255,220,150,0)");
    ctx.fillStyle = beam;
    ctx.fillRect(-c, -size * 0.012, size, size * 0.024);
    ctx.restore();
  });

  return new THREE.CanvasTexture(canvas);
}

function makeSunTexture(size = 256) {
  const canvas = makeCanvas(size);
  const ctx = canvas.getContext("2d");
  const base = ctx.createRadialGradient(
    size * 0.5,
    size * 0.5,
    0,
    size * 0.5,
    size * 0.5,
    size * 0.7
  );
  base.addColorStop(0, "#fff3c4");
  base.addColorStop(0.45, "#ffd166");
  base.addColorStop(0.8, "#ff9d3d");
  base.addColorStop(1, "#ff7a1a");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  ctx.globalCompositeOperation = "overlay";
  for (let i = 0; i < 140; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 4 + Math.random() * 10;
    const shade = Math.random() > 0.5 ? "rgba(255,230,170,0.25)" : "rgba(190,80,10,0.2)";
    ctx.fillStyle = shade;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
  }
  return new THREE.CanvasTexture(canvas);
}

function makeEarthTexture(size = 256) {
  const canvas = makeCanvas(size);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#0e3d78";
  ctx.fillRect(0, 0, size, size);

  const oceanShade = ctx.createLinearGradient(0, 0, 0, size);
  oceanShade.addColorStop(0, "rgba(255,255,255,0.08)");
  oceanShade.addColorStop(0.5, "rgba(0,0,0,0)");
  oceanShade.addColorStop(1, "rgba(255,255,255,0.08)");
  ctx.fillStyle = oceanShade;
  ctx.fillRect(0, 0, size, size);

  const blobColors = ["#2f7d4f", "#4d8f4a", "#7a6b3d", "#5f8f3d"];
  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < 26; i++) {
    const cx = rand() * size;
    const cy = size * 0.15 + rand() * size * 0.7;
    const blobR = size * (0.04 + rand() * 0.09);
    ctx.fillStyle = blobColors[Math.floor(rand() * blobColors.length)];
    ctx.beginPath();
    ctx.ellipse(
      cx,
      cy,
      blobR,
      blobR * (0.5 + rand() * 0.6),
      rand() * TAU,
      0,
      TAU
    );
    ctx.fill();
  }

  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillRect(0, 0, size, size * 0.06);
  ctx.fillRect(0, size * 0.94, size, size * 0.06);

  return new THREE.CanvasTexture(canvas);
}

function makeCloudTexture(size = 256) {
  const canvas = makeCanvas(size);
  const ctx = canvas.getContext("2d");
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < 55; i++) {
    const cx = rand() * size;
    const cy = rand() * size;
    const r = size * (0.02 + rand() * 0.05);
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, "rgba(255,255,255,0.55)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fill();
  }
  return new THREE.CanvasTexture(canvas);
}

function makeMoonTexture(size = 256) {
  const canvas = makeCanvas(size);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#b7b4ae";
  ctx.fillRect(0, 0, size, size);

  let seed = 13;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < 10; i++) {
    const cx = rand() * size;
    const cy = rand() * size;
    const r = size * (0.05 + rand() * 0.12);
    ctx.fillStyle = "rgba(120,116,110,0.55)";
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fill();
  }
  for (let i = 0; i < 90; i++) {
    const cx = rand() * size;
    const cy = rand() * size;
    const r = size * (0.006 + rand() * 0.018);
    ctx.fillStyle = "rgba(90,88,84,0.5)";
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "rgba(200,198,192,0.35)";
    ctx.beginPath();
    ctx.arc(cx - r * 0.3, cy - r * 0.3, r * 0.5, 0, TAU);
    ctx.fill();
  }
  return new THREE.CanvasTexture(canvas);
}

function makeStarField() {
  const count = 900;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const palette = [
    [0.8, 0.88, 1],
    [1, 1, 1],
    [1, 0.92, 0.8],
  ];
  for (let i = 0; i < count; i++) {
    const radius = 30 + Math.random() * 40;
    const theta = Math.random() * TAU;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi) * 0.6;
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    const [r, g, b] = palette[Math.floor(Math.random() * palette.length)];
    const flicker = 0.5 + Math.random() * 0.5;
    colors[i * 3] = r * flicker;
    colors[i * 3 + 1] = g * flicker;
    colors[i * 3 + 2] = b * flicker;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size: 0.16,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  });
  return new THREE.Points(geometry, material);
}

// ---- scene constants ------------------------------------------------------

const SUN_RADIUS = 2.0;
const EARTH_ORBIT_RADIUS = 7;
const EARTH_RADIUS = 0.8;
const MOON_ORBIT_RADIUS = 1.2;
const MOON_RADIUS = 0.4;

// how fast the moon sweeps past the sun/earth's shadow, in radians/second,
// and the choreography of the solar-eclipse sequence (angles are measured
// as signed distance from exact sun-moon-earth alignment)
const BASE_SYNODIC_RATE = TAU / 22;
const SLOW_SYNODIC_RATE = 0.0975;
const RATE_APPROACH_SPEED = 1.2;
const TOTALITY_HOLD_SECONDS = 2;
const EARTH_ANGLE_RATE = 0.045;
const INGRESS_START_DELTA = -0.62;
const TOTALITY_START_DELTA = -0.02;
const EGRESS_END_DELTA = 0.62;

const SolarEclipse = () => {
  const mountRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    let width = mount.clientWidth;
    let height = mount.clientHeight;

    // Tracks how much of the hero section is actually on screen, so the
    // totality dimming only ever engages while someone is looking at the
    // intro — never while they've scrolled down to read the rest of the
    // page.
    const visibilityRef = { current: 1 };
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visibilityRef.current = entry.intersectionRatio;
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }
    );
    visibilityObserver.observe(mount);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.05, 200);
    camera.position.set(0, 5, 16);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    const stars = makeStarField();
    scene.add(stars);

    // orbit path (faint ring showing earth's path around the sun)
    const orbitCurve = new THREE.EllipseCurve(0, 0, EARTH_ORBIT_RADIUS, EARTH_ORBIT_RADIUS);
    const orbitPoints = orbitCurve.getPoints(128).map((p) => new THREE.Vector3(p.x, 0, p.y));
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbitMaterial = new THREE.LineBasicMaterial({
      color: 0x4d6a99,
      transparent: true,
      opacity: 0.25,
    });
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    scene.add(orbitLine);

    // sun
    const sunTexture = makeSunTexture();
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(SUN_RADIUS, 48, 48),
      new THREE.MeshBasicMaterial({ map: sunTexture })
    );
    scene.add(sun);

    const sunGlowTexture = makeRadialTexture([
      { offset: 0, color: "rgba(255,244,214,0.9)" },
      { offset: 0.35, color: "rgba(255,200,110,0.45)" },
      { offset: 1, color: "rgba(255,160,60,0)" },
    ]);
    const sunGlow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: sunGlowTexture,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      })
    );
    sunGlow.scale.set(9, 9, 1);
    sun.add(sunGlow);

    // corona ring sprite - stays mostly hidden behind the glow until the
    // moon occludes the sun's disc, at which point its outer band reads as
    // the classic eclipse "ring"
    const coronaTexture = makeRadialTexture([
      { offset: 0, color: "rgba(255,255,255,0)" },
      { offset: 0.55, color: "rgba(255,255,255,0)" },
      { offset: 0.66, color: "rgba(255,248,224,0.95)" },
      { offset: 0.78, color: "rgba(255,208,140,0.55)" },
      { offset: 1, color: "rgba(255,180,90,0)" },
    ]);
    const corona = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: coronaTexture,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        opacity: 0,
      })
    );
    corona.scale.set(5.4, 5.4, 1);
    sun.add(corona);

    // diamond-ring flare, pulses briefly at eclipse ingress/egress
    const flareTexture = makeFlareTexture();
    const flare = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: flareTexture,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        opacity: 0,
      })
    );
    flare.scale.set(3.6, 3.6, 1);
    sun.add(flare);

    const sunLight = new THREE.PointLight(0xfff2cc, 2.4, 0, 2);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(1024, 1024);
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 30;
    sun.add(sunLight);

    const ambient = new THREE.AmbientLight(0x1a2a4a, 0.35);
    scene.add(ambient);

    // soft red fill light used to give the eclipsed moon a "blood moon"
    // glow instead of going pure black
    const eclipseGlow = new THREE.PointLight(0xff3b1f, 0, 12, 2);
    scene.add(eclipseGlow);

    // earth
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_RADIUS, 48, 48),
      new THREE.MeshPhongMaterial({
        map: makeEarthTexture(),
        shininess: 10,
        specular: 0x224466,
      })
    );
    earth.castShadow = true;
    earth.receiveShadow = true;
    earthGroup.add(earth);

    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_RADIUS * 1.03, 32, 32),
      new THREE.MeshPhongMaterial({
        map: makeCloudTexture(),
        transparent: true,
        depthWrite: false,
      })
    );
    earthGroup.add(clouds);

    // moon
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(MOON_RADIUS, 32, 32),
      new THREE.MeshStandardMaterial({
        map: makeMoonTexture(),
        roughness: 1,
        metalness: 0,
        emissive: new THREE.Color(0x000000),
      })
    );
    moon.castShadow = true;
    moon.receiveShadow = true;
    scene.add(moon);

    // ---- animation state ----
    const clock = new THREE.Clock();
    const cameraPos = camera.position.clone();
    const cameraTarget = new THREE.Vector3();

    // persistent state for the solar-eclipse choreography: a small state
    // machine that slows the moon's approach to the sun, holds on full
    // totality, then eases back up to normal speed on the way out
    const state = {
      mode: "CRUISING",
      modeTimer: 0,
      rate: BASE_SYNODIC_RATE,
      synodic: 0.9,
      earthAngle: 0.6,
      realTime: 0,
      flareSpin: 0,
      coronaOpacity: 0,
      coronaColorMix: 0,
      flareOpacity: 0,
      sunLightIntensity: 2.4,
      sunGlowOpacity: 1,
      moonOrangeMix: 0,
      overlayOpacity: 0,
    };

    const tmp = {
      sunPos: new THREE.Vector3(),
      earthPos: new THREE.Vector3(),
      moonPos: new THREE.Vector3(),
      dirEarthToSun: new THREE.Vector3(),
      dirEarthToMoon: new THREE.Vector3(),
      solarCam: new THREE.Vector3(),
      lunarCam: new THREE.Vector3(),
      wideCam: new THREE.Vector3(),
      blendedCam: new THREE.Vector3(),
      solarTarget: new THREE.Vector3(),
      lunarTarget: new THREE.Vector3(),
      wideTarget: new THREE.Vector3(),
      blendedTarget: new THREE.Vector3(),
      perp: new THREE.Vector3(),
      up: new THREE.Vector3(0, 1, 0),
    };

    function updateScene(dt) {
      state.realTime += dt;

      // --- eclipse choreography state machine ---
      // `delta` is the signed angular distance to exact sun-moon-earth
      // alignment: negative = moon approaching the sun, positive = moon
      // departing. Driving speed off this state (rather than off wall
      // clock time) is what lets us slow to a crawl on approach, freeze
      // for the totality beats, then ease back up to full speed.
      const delta = wrapAngle(state.synodic);
      let targetRate = BASE_SYNODIC_RATE;

      switch (state.mode) {
        case "INGRESS":
          targetRate = SLOW_SYNODIC_RATE;
          if (delta >= TOTALITY_START_DELTA) {
            state.mode = "TOTALITY_BLACK";
            state.modeTimer = 0;
          }
          break;
        case "TOTALITY_BLACK":
          targetRate = 0;
          state.modeTimer += dt;
          if (state.modeTimer >= TOTALITY_HOLD_SECONDS) {
            state.mode = "TOTALITY_ORANGE";
            state.modeTimer = 0;
          }
          break;
        case "TOTALITY_ORANGE":
          targetRate = 0;
          state.modeTimer += dt;
          if (state.modeTimer >= TOTALITY_HOLD_SECONDS) {
            state.mode = "EGRESS";
          }
          break;
        case "EGRESS":
          targetRate = SLOW_SYNODIC_RATE;
          if (delta >= EGRESS_END_DELTA) {
            state.mode = "CRUISING";
          }
          break;
        case "CRUISING":
        default:
          targetRate = BASE_SYNODIC_RATE;
          if (delta > INGRESS_START_DELTA && delta < TOTALITY_START_DELTA) {
            state.mode = "INGRESS";
          }
          break;
      }

      state.rate = approach(state.rate, targetRate, dt, RATE_APPROACH_SPEED);
      state.synodic += state.rate * dt;
      state.earthAngle += EARTH_ANGLE_RATE * dt;

      tmp.earthPos.set(
        Math.cos(state.earthAngle) * EARTH_ORBIT_RADIUS,
        0,
        Math.sin(state.earthAngle) * EARTH_ORBIT_RADIUS
      );
      earthGroup.position.copy(tmp.earthPos);
      earthGroup.rotation.y += dt * 0.6;
      clouds.rotation.y += dt * 0.09;

      const moonAngle = state.earthAngle + Math.PI + state.synodic;
      tmp.moonPos.set(
        tmp.earthPos.x + Math.cos(moonAngle) * MOON_ORBIT_RADIUS,
        0,
        tmp.earthPos.z + Math.sin(moonAngle) * MOON_ORBIT_RADIUS
      );
      moon.position.copy(tmp.moonPos);

      tmp.dirEarthToSun.copy(tmp.sunPos).sub(tmp.earthPos).normalize();
      tmp.dirEarthToMoon.copy(tmp.moonPos).sub(tmp.earthPos).normalize();
      tmp.perp.crossVectors(tmp.dirEarthToSun, tmp.up).normalize();

      const solarProximitySharp = angularPeak(state.synodic, 0, 20);
      const lunarProximitySharp = angularPeak(state.synodic, Math.PI, 10);

      // visual targets: the continuous formulas drive the gradual
      // ingress/egress look, but the two totality holds get an explicit,
      // scripted look — near-total darkness, then a warm ring with an
      // orange-lit moon from the "escaped" light around its edge
      let coronaOpacityTarget = solarProximitySharp;
      let coronaColorMixTarget = 0;
      let flareOpacityTarget = Math.max(
        0,
        4 * solarProximitySharp * (1 - solarProximitySharp) * 1.4 - 0.15
      );
      let sunLightTarget = 2.4 * (1 - 0.55 * solarProximitySharp);
      let sunGlowOpacityTarget = 0.55 + 0.45 * (1 - 0.55 * solarProximitySharp);
      let moonOrangeMixTarget = 0;

      if (state.mode === "TOTALITY_BLACK") {
        coronaOpacityTarget = 0.08;
        flareOpacityTarget = 0;
        sunLightTarget = 0.05;
        sunGlowOpacityTarget = 0.05;
      } else if (state.mode === "TOTALITY_ORANGE") {
        // ring formation: starts as a small bright point (the flare) and
        // slowly brightens/spreads into a full, clearly-shaped ring over
        // the hold, right up until the moon starts sliding away again
        const ringProgress = Math.min(1, state.modeTimer / TOTALITY_HOLD_SECONDS);
        const ringEase = ringProgress * ringProgress * (3 - 2 * ringProgress);
        coronaOpacityTarget = 0.1 + 0.82 * ringEase;
        coronaColorMixTarget = 1;
        flareOpacityTarget = 0.55 * (1 - ringEase) + 0.08;
        sunLightTarget = 0.18;
        sunGlowOpacityTarget = 0.12;
        moonOrangeMixTarget = 1;
      }

      state.coronaOpacity = approach(state.coronaOpacity, coronaOpacityTarget, dt, 2.5);
      state.coronaColorMix = approach(state.coronaColorMix, coronaColorMixTarget, dt, 1.8);
      state.flareOpacity = approach(state.flareOpacity, flareOpacityTarget, dt, 3);
      state.sunLightIntensity = approach(state.sunLightIntensity, sunLightTarget, dt, 2);
      state.sunGlowOpacity = approach(state.sunGlowOpacity, sunGlowOpacityTarget, dt, 2);
      state.moonOrangeMix = approach(state.moonOrangeMix, moonOrangeMixTarget, dt, 2.5);

      corona.material.opacity = state.coronaOpacity;
      corona.material.color.setRGB(
        1,
        1 - 0.45 * state.coronaColorMix,
        1 - 0.75 * state.coronaColorMix
      );
      state.flareSpin += dt * 0.6;
      flare.material.opacity = state.flareOpacity;
      flare.material.rotation = state.flareSpin;

      sunLight.intensity = state.sunLightIntensity;
      sunGlow.material.opacity = state.sunGlowOpacity;

      // dim the whole page — not the animation itself — through totality,
      // then release it the moment the moon starts sliding away again.
      // Gated by how much of the hero is actually on screen, so it never
      // kicks in while someone has scrolled down to read the rest of the
      // page.
      const isTotality = state.mode === "TOTALITY_BLACK" || state.mode === "TOTALITY_ORANGE";
      const overlayTarget = (isTotality ? 0.9 : 0) * visibilityRef.current;
      state.overlayOpacity = approach(state.overlayOpacity, overlayTarget, dt, 1.5);
      if (overlayRef.current) {
        overlayRef.current.style.opacity = state.overlayOpacity;
      }

      // earth's shadow gives the moon a soft red "blood moon" glow during
      // the lunar eclipse only — during the solar eclipse the moon stays
      // its natural grey, letting the corona ring carry the light instead
      eclipseGlow.position.copy(tmp.earthPos).addScaledVector(tmp.dirEarthToMoon, 0.4);
      eclipseGlow.intensity = 2.6 * lunarProximitySharp;
      moon.material.emissive.setRGB(
        0.35 * lunarProximitySharp,
        0.03 * lunarProximitySharp,
        0.03 * lunarProximitySharp
      );

      // --- camera keyframes ---
      // Both close-up cameras sit essentially at Earth's own position (the
      // real vantage point an eclipse is seen from) and look exactly along
      // the earth->sun / earth->moon axis. Earth's mesh is culled from the
      // inside (back faces only), so parking the camera there doesn't clip
      // — and staying exactly on-axis is what makes the moon precisely
      // cover the sun's disc rather than drifting off to one side.
      tmp.solarCam.copy(tmp.earthPos).addScaledVector(tmp.up, 0.05);
      tmp.solarTarget.copy(tmp.sunPos);

      tmp.lunarCam.copy(tmp.earthPos).addScaledVector(tmp.up, 0.05);
      tmp.lunarTarget.copy(tmp.moonPos);

      // The "wide" shot is a pull-back FROM Earth's current position
      // (rather than an independently orbiting camera), so every keyframe
      // stays clustered near Earth and blending between them never swings
      // the camera through the sun or moon.
      const radialOut = tmp.earthPos.clone().normalize();
      tmp.wideCam
        .copy(tmp.earthPos)
        .addScaledVector(radialOut, 5.5)
        .addScaledVector(tmp.up, 3.1)
        .addScaledVector(tmp.perp, Math.sin(state.realTime * 0.15) * 1.1);
      tmp.wideTarget.copy(tmp.earthPos).multiplyScalar(0.55);

      const wSolar = angularPeak(state.synodic, 0, 2.2);
      const wLunar = angularPeak(state.synodic, Math.PI, 2.2);
      const wWide = Math.max(0, 1 - wSolar - wLunar);
      const wSum = wSolar + wLunar + wWide || 1;

      tmp.blendedCam
        .set(0, 0, 0)
        .addScaledVector(tmp.solarCam, wSolar)
        .addScaledVector(tmp.lunarCam, wLunar)
        .addScaledVector(tmp.wideCam, wWide)
        .multiplyScalar(1 / wSum);

      tmp.blendedTarget
        .set(0, 0, 0)
        .addScaledVector(tmp.solarTarget, wSolar)
        .addScaledVector(tmp.lunarTarget, wLunar)
        .addScaledVector(tmp.wideTarget, wWide)
        .multiplyScalar(1 / wSum);

      const camLerp = 1 - Math.exp(-dt * 4.3);
      cameraPos.lerp(tmp.blendedCam, camLerp);
      cameraTarget.lerp(tmp.blendedTarget, camLerp);
      camera.position.copy(cameraPos);
      camera.lookAt(cameraTarget);

      stars.rotation.y += dt * 0.024;
    }

    let frameId;
    function animate() {
      frameId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.1);
      updateScene(dt);
      renderer.render(scene, camera);
    }
    animate();

    const resizeObserver = new ResizeObserver(() => {
      width = mount.clientWidth;
      height = mount.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(mount);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      mount.removeChild(renderer.domElement);

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
          materials.forEach((m) => {
            if (m.map) m.map.dispose();
            m.dispose();
          });
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <div id="solar-eclipse" ref={mountRef}></div>
      {ReactDOM.createPortal(
        <div className="eclipse-dim-overlay" ref={overlayRef}></div>,
        document.body
      )}
    </>
  );
};

export default SolarEclipse;
