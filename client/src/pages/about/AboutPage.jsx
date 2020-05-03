import React from 'react';


// Common
import A from '../../components/common/A';
import H1 from "../../components/common/H1";

// Styling
import styled from 'styled-components';

function AboutPage(props) {
  return (
    <div {...props}>
      <H1>About</H1>
      <p>This is a project I created for Enterprise Web at university and allows students to sign up using their university credentials.</p>
      <br />
      <p>You can see the navigation to the left which allows you to create a résumé/cv or you can search for jobs in the 'work' page.</p>
      <br />
      <p>To generate the PDF's we use a third party tool called resumake (<A href="https://github.com/saadq/resumake.io/blob/master/license">LICENSE</A>).</p>
    </div>
  );
}

export default styled(AboutPage)`
  color: ${props => props.theme.PALLET['400']};
`;
