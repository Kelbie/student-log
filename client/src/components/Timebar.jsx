import React from 'react';

import styled, { withTheme } from 'styled-components';

import { rgba } from 'polished';

function Pointer(props) {
  return (
    <div {...props}>
      <div></div>
    </div>
  );
}

Pointer = styled(Pointer)`
  width: 10px;
  height: 10px;
  /* border-radius: 100%; */
  right: 50%;
  position: absolute;
  transform: translate(50%);
  background: -webkit-radial-gradient(#f89844, #de3959);

  div {
    width: 8px;
    height: 8px;
    background: #17171c;
    /* border-radius: 100%; */
    right: 50%;
    bottom: 50%;
    position: absolute;
    transform: translate(50%, 50%);
  }
`;

function Timebar(props) {
  return <div {...props}>{/* <Pointer/> */}</div>;
}

Timebar = styled(Timebar)`
  position: relative;
  grid-column: 1;
  grid-row: ${props => props.index + 1} / span 1;
  box-shadow: 0px 0px 4px 1px ${props => rgba(props.theme.SECONDARY_COLOR, 0.25)};

  width: 2px;
  height: calc(100% - 20px);
  margin: auto;
  background: -webkit-linear-gradient(
    ${props => props.theme.PRIMARY_COLOR},
    ${props => props.theme.SECONDARY_COLOR}
  );
`;

export default withTheme(Timebar);
