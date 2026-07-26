import React from "react";
import "../styles/About.css";
import FadeInSection from "./FadeInSection";

class About extends React.Component {
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
    const one = (
      <p>
      I am a <a href="#about">Full-Stack Java Developer</a> with 6+ years of experience delivering enterprise web applications and RESTful services across the complete SDLC, specializing in <strong>FinTech, DevOps, and microservices architecture</strong>. I'm currently a Consultant / Senior Software Engineer with Accenture, working on the TD Bank account. I hold a Master's degree from <a href="https://www.concordia.ca/about.html" target="_blank" rel="noopener noreferrer">Concordia University</a>. Throughout my career, I have collaborated with multinational corporations, leveraging cloud platforms, CI/CD, and Agile methodologies to deliver high-quality, production-grade solutions.
      </p>
    );
    const two = (
      <p>
        Outside of work, I’m all about keeping up with the latest in Computer Science and
        trying to figure out what <a href="#about">Elon Musk</a> is up to next.
        It’s like following a high-tech soap opera—one day he's launching rockets,
        the next day he's tweeting something that makes everyone go, <strong>“Wait, what?”</strong>
      </p>
    );

    const tech_stack = [
      "Java, J2EE",
      "Spring Boot",
      "AWS, Azure",
      "Apache Kafka",
      "Kubernetes",
      "CI/CD & DevOps",
      "SQL, NO-SQL DBs"
    ];

    return (
      <div id="about">
        <FadeInSection>
          <div className="section-header ">
            <span className="section-title">/ about me</span>
          </div>
          <div className="about-content">
            <div className="about-description">
              {[one]}
              {"Here are some technologies I have been working with:"}
              <ul className="tech-stack">
                {tech_stack.map(function (tech_item, i) {
                  return (
                    <FadeInSection delay={`${i + 1}00ms`}>
                      <li>{tech_item}</li>
                    </FadeInSection>
                  );
                })}
              </ul>
              {[two]}
            </div>
            <div className="about-image">
              <img alt="Sarath Nadavalur" src={"./assets/sarath.jpg"} />
            </div>
          </div>
        </FadeInSection>
      </div>
    );
  }
}

export default About;
