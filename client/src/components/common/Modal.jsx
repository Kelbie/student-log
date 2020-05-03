import React from 'react';

import ReactModal from 'react-modal';

// Wrapper for ReactModal
function Modal({ children, ...props }) {
  return <ReactModal {...props}>{children}</ReactModal>;
}

export default Modal;
