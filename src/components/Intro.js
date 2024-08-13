import React from "react";

import "../styles/Intro.css";
import Typist from "react-typist";
import "react-typist/dist/Typist.css";
import EmailRoundedIcon from "@material-ui/icons/EmailRounded";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import FadeInSection from "./FadeInSection";
import FractalTree from "./FractalTree";

class Intro extends React.Component {
  constructor() {
    super();
    this.state = {
      expanded: true,
      activeKey: "1",
      visible: true,
    };
    this.handleSelect = this.handleSelect.bind(this);
  }
  handleSelect(eventKey) {
    this.setState({
      activeKey: eventKey,
    });
  }
  render() {
    return (
      <div id="intro">
        <FractalTree></FractalTree>
        <Typist avgTypingDelay={120}>
          <span className="intro-title">
            {"knock knock, "}
            <span className="intro-name">{"Sarath"}</span>
            {" here."}
          </span>
        </Typist>
        <FadeInSection>
          <div className="intro-subtitle">powered by coffee and code..!</div>
          <div className="intro-desc">

          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <a
                          href="mailto:sarath.nadavalur@gmail.com"
                          className="intro-contact"
                        >
                          <EmailRoundedIcon></EmailRoundedIcon>
                          {" Ping me !"}
                        </a>
                        <a
                          href="https://flowcv.com/resume/0onlhsa9cf" target="_blank"
                          className="intro-contact"
                        >
                          <LibraryBooks></LibraryBooks>
                          {" View Resume"}
                        </a>
            </div>

        </FadeInSection>
      </div>
    );
  }
}

export default Intro;
