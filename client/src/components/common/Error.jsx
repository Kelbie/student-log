import React from 'react';

// Forms
import { ErrorMessage } from 'react-hook-form';

// Styling
import styled from 'styled-components';

// Wrapper for ErrorMessage
function Error(props) {
  return <ErrorMessage {...props}>{({ message }) => <p {...props}>{message}</p>}</ErrorMessage>;
}

export default styled(Error)`
  color: ${props => props.theme.PRIMARY_COLOR};
`;
