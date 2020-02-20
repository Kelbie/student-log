import React from 'react';

import { ErrorMessage } from 'react-hook-form';

import styled from 'styled-components';

function Error(props) {
  return <ErrorMessage {...props}>{({ message }) => <p {...props}>{message}</p>}</ErrorMessage>;
}

export default styled(Error)`
  color: ${props => props.theme.PRIMARY_COLOR};
`;
