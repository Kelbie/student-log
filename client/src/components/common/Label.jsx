import React from 'react';

// Styling
import styled from 'styled-components';

// Wrapper for Label
function Label(props) {
  return <label {...props}>{props.children}</label>;
}

export default styled(Label)`
  font-size: 20px;
  color: ${props =>
    props.theme.is === 'dark' ? props.theme.PALLET['400'] : props.theme.PALLET['600']};
  font-weight: bold;
  margin: 4px 0px;

  /* Required marker */
  &::after {
    content: ${props => (props.required ? "''" : 'none')};
    width: 8px;
    height: 8px;
    display: inline-block;
    background: ${props => props.theme.PRIMARY_COLOR};
    border-radius: 100%;
    margin-left: 4px;
    vertical-align: middle;
  }
`;
