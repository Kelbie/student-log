import React from 'react';

// Styling
import styled from 'styled-components';
import { rgba } from 'polished';

// Wrapper for input
const Input = React.forwardRef((props, ref) => {
  return <input {...props} ref={ref}></input>;
});

export default styled(Input)`
  /* Remove default styles */
  &:focus {
    outline: none;
  }

  width: 100%;
  color: ${props =>
    props.theme.is === 'dark' ? props.theme.PALLET['400'] : props.theme.PALLET['600']};
  background: -webkit-linear-gradient(
    ${props => rgba(props.theme.PRIMARY_COLOR, 0.05)},
    ${props => rgba(props.theme.SECONDARY_COLOR, 0.05)}
  );
  border: 1px solid ${props => rgba(props.theme.PRIMARY_COLOR, 0.5)};
  padding: 8px;
  border-radius: 4px;
`;
