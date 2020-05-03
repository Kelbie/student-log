import React, { useContext } from 'react';
import styled from 'styled-components';

import ThemeContext from '../context';

function Card(props) {
  const theme = useContext(ThemeContext);
  return (
    <div {...props} className={`${props.className} ${theme}`}>
      {props.children}
    </div>
  );
}

export default styled(Card)`
  text-align: left;
  padding: 24px;
  background: ${props => (props.theme.is === 'dark' ? '#24252d' : 'white')};
  border-radius: 4px;
`;
