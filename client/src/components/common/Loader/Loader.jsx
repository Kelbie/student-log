import React from 'react';

import styled, { withTheme } from 'styled-components';
import TailSpin from './TailSpin';

function Loader(props) {
  return (
    <div aria-busy="true" className={props.className} style={props.style}>
      <TailSpin {...props} color={props.theme.PRIMARY_COLOR}></TailSpin>
    </div>
  );
}

export default styled(withTheme(Loader))`
  svg {
    animation: rotate 0.5s linear infinite;
    fill: red;
  }

  @keyframes rotate {
    to {
      transform: rotate(360deg);
    }
  }
`;
