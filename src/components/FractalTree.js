import React, { useEffect, useRef } from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";
import "../styles/FractalTree.css";

let angle;
let scaleFactor = 1;

const Sketch = (p5) => {
  p5.setup = () => {
    p5.createCanvas(400, 400, "transparent");
    angle = p5.PI / 4;
  };

  p5.draw = () => {
    // Adjust scale factor based on angle
    scaleFactor = p5.map(angle, p5.PI / 16, p5.PI / 2, 0.5, 1.5);

    // Calculate color components based on scale factor
    let colorComponent = p5.map(scaleFactor, 0.7, 1.3, 255, 0); // Transition from white (255) to cyan's green and blue components (0)
    p5.stroke(colorComponent, 255, 255); // Cyan with varying red component

    p5.clear();
    p5.translate(200, p5.height);
    p5.scale(scaleFactor);
    angle = p5.map(p5.sin(p5.frameCount * 0.01), -1, 1, p5.PI / 2, p5.PI / 16);

    branch(100);
  };

  function branch(len) {
    p5.strokeWeight(p5.map(len, 4, 100, 1, 5));
    p5.line(0, 0, 0, -len);
    p5.translate(0, -len);
    if (len > 4) {
      p5.push();
      p5.rotate(angle);
      branch(len * 0.67);
      p5.pop();
      p5.push();
      p5.rotate(-angle);
      branch(len * 0.67);
      p5.pop();
    }
  }
};

const FractalTree = () => {
  const canvasContainerRef = useRef(null);
  const p5InstanceRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const container = canvasContainerRef.current;
      if (container && p5InstanceRef.current) {
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        p5InstanceRef.current.resizeCanvas(width, height);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSketchLoad = (p5) => {
    p5InstanceRef.current = p5;
  }

  return (
    <div id="fractal-tree" ref={canvasContainerRef}>
      <ReactP5Wrapper sketch={Sketch} onReady={handleSketchLoad} />
    </div>
  );
};

export default FractalTree;
