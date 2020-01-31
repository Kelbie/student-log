import React from "react";

import styled from "styled-components";

import Markdown from "react-markdown";

function WorkPosting(props) {
    return <div {...props}>
        <div className="job-desc">
            <Markdown source={`
AdButler is hiring!


We are growing our Customer Support team, seeking the best and brightest to join our ranks as a Customer Support agent. In this position, you’ll become part of our front-line customer support team, responsible for handling product support, implementation, onboarding and assisting in demonstrations.


### Things you’d be doing:


- Inbound product support through various channels (Phone, Live Chat, Email, Ticket).
- Onboarding new customers, assisting them in setting up their account.
- Assisting in doing online demonstrations of the platform with the sales team.
- Identify patterns in user feedback and provide suggestions and recommendations to the development team.
- Actively involved in helping share the future of the product and platform.
- Participate in weekly team meetings and continual training.
- Identify known issues and escalate it up the support chain as required.
- Work varying hours.
- Travel to conferences and events.


### What you bring to the table:


- Enjoy helping customers solve problems.
- An eagerness to learn new technologies.
- Ability to commit to a varying schedule.
- Able to legally work in Canada, or as an independent contractor in your country.
- Excellent written and verbal communication skills (English Requirement)
- Highly motivated and a self-starter.
- Excellent soft-skills and personality.


### The ideal candidate has:


- Experience of education in Ad-Tech, Ad-Ops or Marketing.
- Experience in SaaS solutions.
- Experience troubleshooting technical problems.
- Experience working remotely.


### What we offer:


- An excellent remuneration package plus the ability to earn quarterly bonuses based on performance.
- Employer Paid Benefits (Canadian residents)
- Unlimited Paid Time Off Policy
- Employer Paid Ad-Ops training and courses.
- Flexibility to work anywhere with a high-speed internet connection.
- Flexible schedule
            `} />
        </div>
    </div>
}

WorkPosting = styled(WorkPosting)`
    ${Markdown} {
        * {
            color: ${props => props.theme.is === "dark" ? "#E0E0E0" : "#17171C"};
            font-family: Montserrat;
        }
        ul {
            margin-left: 20px;
        }
    }
`;

export default WorkPosting;