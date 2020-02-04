import React from 'react';
import styled from 'styled-components';

function AboutPage(props) {
  return (
    <div {...props}>
      <h1>About</h1>
      <p>This website is a student portal which allows students to:</p>
      <ul>
        <li>Build their CV</li>
        <li>Find internships and graduate jobs</li>
        <li></li>
      </ul>
    </div>
  );
}

export default styled(AboutPage)`
  color: white;
`;
