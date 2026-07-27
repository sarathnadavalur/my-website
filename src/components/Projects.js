import React from "react";
import "../styles/Projects.css";
import FolderOpenRoundedIcon from "@material-ui/icons/FolderOpenRounded";
import FadeInSection from "./FadeInSection";
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
