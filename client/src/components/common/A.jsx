import React from 'react';

import { Link } from 'react-router-dom';

// Styling
import styled from 'styled-components';

// Wrapper for react-router-dom Link
function A(props) {
  return <Link {...props}>{props.children}</Link>;
}

A = styled(A)`
  cursor: pointer;
  position: relative;
  text-decoration: none;
  background: -webkit-linear-gradient(
    ${props => props.theme.PRIMARY_COLOR},
    ${props => props.theme.SECONDARY_COLOR}
  );
  position: sticky;
  background: -webkit-linear-gradient(
    ${props => props.theme.PRIMARY_COLOR},
    ${props => props.theme.SECONDARY_COLOR}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  &:after {
    content: '';
    transition: 0.3s ease 0s;
    bottom: 0;
    left: 0;
    width: 0%;
    position: absolute;
    height: 1px;
    background: -webkit-linear-gradient(
      ${props => props.theme.PRIMARY_COLOR},
      ${props => props.theme.SECONDARY_COLOR}
    );
  }
`;

export default A;
