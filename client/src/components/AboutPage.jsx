import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import A from './A';

function AboutPage(props) {
  return (
    <div {...props}>
      <h1>About</h1>
      <p>This website is a student portal which allows students to:</p>
      <ul>
        <li>Build their CV</li>
        <li>Find internships and graduate jobs</li>
        <li>View bus times nearby the university</li>
        <li>Find student accommodation</li>
      </ul>
      <br></br>
      <h2>The Stack</h2>
      <h3>Backend</h3>
      <ul>
        <li>
          Node (<A to="https://github.com/nodejs/node/blob/master/LICENSE">LICENSE</A>)
        </li>
        <li>
          Express (<A to="https://github.com/expressjs/express/blob/master/LICENSE">LICENSE</A>)
        </li>
        <li>
          GraphQL-Yoga (
          <A to="https://github.com/prisma-labs/graphql-yoga/blob/master/LICENSE">LICENSE</A>)
        </li>
        <li>PostgreSQL</li>
        <li>Microsoft AD</li>
        <li>Stripe?</li>
        <li>
          Locally hosted <A to="https://resumake.io">resumake.io</A> (
          <A to="https://github.com/saadq/resumake.io/blob/master/license">LICENSE</A>)
        </li>
        <li>
          <A to="https://www.transportapi.com/">transportapi.com</A> for bus arrival and departure
          times
        </li>
        <li>
          <A to="">Celcat</A> for timetable information
        </li>
      </ul>
      <br></br>
      <h3>Front-end</h3>
      <ul>
        <li>React</li>
        <li>Redux</li>
        <li>Styled Components</li>
        <li>
          <A to="https://tailwindcss.com/docs/customizing-colors/">Tailwind.css Colour Guide</A>
        </li>
      </ul>
      <br></br>
      <h3>Tools</h3>
      <ul>
        <li>Babel</li>
        <li>EsLint</li>
        <li>Google Maps</li>
      </ul>
    </div>
  );
}

export default styled(AboutPage)`
  color: white;
`;
