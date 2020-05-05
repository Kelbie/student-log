import React from 'react';

// Styling
import styled, { withTheme } from 'styled-components';

// Components
import ThemePicker from './ThemePicker';

// Header which shows "studentlog" and theme picker
function Header(props) {
  return (
    <div {...props}>
      <h1>
        <span id="student">STUDENT</span>
        <span id="log">LOG</span>
      </h1>
      <div>
        <ThemePicker />
      </div>
    </div>
  );
}

Header = styled(Header)`
  width: 100vw;
  max-width: 800px;
  margin: auto;
  padding: 24px 0px 8px 12px !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: auto !important;

  h1 {
    font-size: 20px;
    color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['400'] : props.theme.PALLET['600']};

    span#log {
      font-weight: 600;
      position: sticky;
      background: -webkit-linear-gradient(
        ${props => props.theme.PRIMARY_COLOR},
        ${props => props.theme.SECONDARY_COLOR}
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
`;

export default withTheme(Header);
