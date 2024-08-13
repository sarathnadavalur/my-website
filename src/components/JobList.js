import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import FadeInSection from "./FadeInSection";

const isHorizontal = window.innerWidth < 600;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  if (isHorizontal) {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  } else {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  if (isHorizontal) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`
    };
  } else {
    return {
      id: `vertical-tab-${index}`
    };
  }
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: "theme.palette.background.paper",
    display: "flex",
    height: 300
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}));

const JobList = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const experienceItems = {
    "8x8 Inc, California, US": {
      jobTitle: "Senior Software Engineer @",
      duration: "SEP 2022 - MAR 2024",
      desc: [
        "Orchestrated invoice management within billing team for the telecom SaaS product, overseeing accurate storage of customer invoices and facilitating seamless payment processing (credit / debit cards, ACH) using GoCardless and NACHA platforms for over 2 million monthly transactions. Collaborated with the Salesforce team, using custom APIs and SOQL queries to extract customer data. Developed the customer-facing self-service portal, enabling payment and downloading invoices/CDRs/service summaries using AWS S3 and ECS.",
        "Refactored a complex monolithic application into independent microservices architecture. Engineered reusable Java libraries."
      ]
    },
    "Concordia University": {
      jobTitle: "Master's in IE @",
      duration: "JAN 2021 - JUN 2022",
      desc: [
        "Applied a systems-thinking approach gained from Industrial Engineering to software development projects.  Excelled at analyzing interdependencies and identifying potential bottlenecks, resulting in more resilient and scalable software solutions.",
        "GPA - 92%"
      ]
    },
    "L&T TS, Chennai, India": {
      jobTitle: "Engineer @",
      duration: "DEC 2016 - AUG 2020",
      desc: [
        "Engineered a tiered backend credit card rewards program, calculating cashback and rewards based on customer spending and merchant partnerships. Implemented partner onboarding module, facilitating seamless integration of external businesses. Designed a robust transaction tracking system to update user accounts, drive internal metrics reporting, and ensure accurate rewards/discount calculations.",
        "Spearheaded full-stack Java development across financial (FinTech), e-commerce, and telecom sectors, leveraging Spring Boot, RESTful APIs, and scalable microservices, with experience in processing credit card, ACH, and debit card payments.",
        ]
    },
    "SASTRA University": {
      jobTitle: "Bachelor's in ME @",
      duration: "JUN 2012 - JUN 2016",
      desc: [
        "Strong foundation in Mechanical Engineering principles to analyze complex problems and develop efficient solutions within software development projects. Demonstrated the ability to translate technical understanding into practical, optimized software designs.",
        "GPA - 84%"
      ]
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation={!isHorizontal ? "vertical" : null}
        variant={isHorizontal ? "fullWidth" : "scrollable"}
        value={value}
        onChange={handleChange}
        className={classes.tabs}
      >
        {Object.keys(experienceItems).map((key, i) => (
          <Tab label={isHorizontal ? `0${i}.` : key} {...a11yProps(i)} />
        ))}
      </Tabs>
      {Object.keys(experienceItems).map((key, i) => (
        <TabPanel value={value} index={i}>
          <span className="joblist-job-title">
            {experienceItems[key]["jobTitle"] + " "}
          </span>
          <span className="joblist-job-company">{key}</span>
          <div className="joblist-duration">
            {experienceItems[key]["duration"]}
          </div>
          <ul className="job-description">
            {experienceItems[key]["desc"].map(function (descItem, i) {
              return (
                <FadeInSection delay={`${i + 1}00ms`}>
                  <li key={i}>{descItem}</li>
                </FadeInSection>
              );
            })}
          </ul>
        </TabPanel>
      ))}
    </div>
  );
};

export default JobList;
