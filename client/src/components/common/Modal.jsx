import React from 'react';

import styled from 'styled-components';
import { rgba } from 'polished';
import ReactModal from 'react-modal';
function Modal({ children, ...props }) {
  return <ReactModal {...props}>{children}</ReactModal>;
}

export default styled(Modal)``;
