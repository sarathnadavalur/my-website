import React from "react";
import "../styles/Projects.css";
import FolderOpenRoundedIcon from "@material-ui/icons/FolderOpenRounded";
import FadeInSection from "./FadeInSection";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import Carousel from "react-bootstrap/Carousel";
import ExternalLinks from "./ExternalLinks";

class Projects extends React.Component {
  constructor() {
    super();
    this.state = {
      expanded: true,
      activeKey: "1"
    };
    this.handleSelect = this.handleSelect.bind(this);
  }
  handleSelect(eventKey) {
    this.setState({
      activeKey: eventKey
    });
  }
  render() {
    const spotlightProjects = {
      "No Man's Land": {
        title: "no man's land",
        desc:
          "A third-person survival-mode game where you battle against time and space to return to Earth.",
        techStack: "C# (UNITY)",
        link: "https://github.com/slakh96/no-mans-land",
        open: "https://gazijarin.itch.io/no-mans-land",
        image: "/assets/nomansland.png"
      },
      Truth: {
        title: "truth",
        desc:
          "A three.js simulation of the planet system revolving around a monolith.",
        techStack: "JAVASCRIPT (THREE.JS)",
        link: "https://github.com/gazijarin/truth",
        open: "https://gazijarin.github.io/Truth/",
        image: "/assets/truth.png"
      },
      "Tall Tales": {
        title: "tall tales",
        desc:
          "A multi-player story-telling web game for 3-5 players. Its usage of sockets to allow for concurrent gameplay, connecting friends across the internet.",
        techStack: "NODE.JS (SOCKET.IO), REACT.JS, MONGODB",
        link: "https://github.com/gazijarin/TallTales",
        open: "https://talltales.herokuapp.com/",
        image: "/assets/talltales.png"
      },
      Portfolio: {
        title: "portfolio.js",
        desc:
          "A small JS library that helps with clear and succinct data presentation.",
        techStack: "NODE.JS (EXPRESS.JS)",
        link: "https://github.com/gazijarin/Portfolio.js",
        open: "https://afternoon-ocean-92382.herokuapp.com/",
        image: "/assets/portfolio.png"
      }
    };
    const projects = {
      "Rewards-to-Loyalty Points Conversion": {
        desc:
          "Built capability enabling TD Bank customers to convert accumulated rewards into partner loyalty points (Starbucks, Uber), including a 'Pay with Rewards' feature to offset purchases directly.",
        techStack: "Java 17, Spring Boot, REST APIs"
      },
      "Customer Self-Service Billing Portal": {
        desc:
          "Customer-facing self-service portal enabling payment and downloads of invoices, CDRs, and service summaries for a telecom SaaS product processing over 2 million monthly transactions.",
        techStack: "Java, Spring Boot, AWS S3, ECS"
      },
      "Recovery-Enabled Workflow Engine": {
        desc:
          "Reusable Java library powering a recovery-enabled workflow engine for event-driven microservices, improving processing efficiency by 35% while handling 24 million monthly Kafka messages.",
        techStack: "Java, Apache Kafka, Microservices"
      },
      "Recovery & DLQ Management Console": {
        desc:
          "Single-page application for recovery and dead-letter-queue (DLQ) management of failed transactions, reducing manual intervention by 90%.",
        techStack: "React.js, Java, Spring Boot"
      },
      "Credit Card Rewards Engine": {
        desc:
          "Tiered backend rewards program calculating cashback based on customer spending and merchant partnerships, with a partner onboarding module for seamless integration of external businesses.",
        techStack: "Java, Spring Boot, REST APIs"
      },
      "Infrastructure Monitoring & Alerting": {
        desc:
          "Infrastructure monitoring with alerting and dashboards supporting production health checks and P1-P3 incident response via ServiceNow.",
        techStack: "Splunk, Dynatrace, Datadog"
      }
    };

    return (
      <div id="projects">
        <div className="section-header ">
          <span className="section-title">/ projects</span>
        </div>
        <div className="project-container">
          <ul className="projects-grid">
            {Object.keys(projects).map((key, i) => (
              <FadeInSection delay={`${i + 1}00ms`}>
                <li className="projects-card">
                  <div className="card-header">
                    <div className="folder-icon">
                      <FolderOpenRoundedIcon
                        style={{ fontSize: 35 }}
                      ></FolderOpenRoundedIcon>
                    </div>
                    <ExternalLinks
                      githubLink={projects[key]["link"]}
                      openLink={projects[key]["open"]}
                    ></ExternalLinks>
                  </div>

                  <div className="card-title">{key}</div>
                  <div className="card-desc">{projects[key]["desc"]}</div>
                  <div className="card-tech">{projects[key]["techStack"]}</div>
                </li>
              </FadeInSection>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Projects;
