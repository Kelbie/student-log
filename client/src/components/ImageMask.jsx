import React from 'react';

import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

function ImageMask(props) {
  return (
    <div {...props}>
      <FontAwesomeIcon icon={faUserCircle} />
      {/* <img src={image0} /> */}
      {props.mask ? <div className="mask" /> : ''}
    </div>
  );
}

ImageMask = styled(ImageMask)`
  width: 100%;
  height: 100%;

  position: relative;
  /* mix-blend-mode: screen; */
  .mask {
    top: 0;
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    background: ${props => (props.theme.is === 'dark' ? 'black' : 'white')};
    z-index: 2;
    left: 22px;
    border-radius: 100%;
  }

  img {
    width: 100%;
    height: 100%;
    border-radius: 100%;
  }

  svg {
    width: 100% !important;
    height: 100% !important;
    fill: ${props => (props.theme.is === 'dark' ? '#24252D' : 'white')};
    color: ${props => (props.theme.is === 'dark' ? '#24252D' : 'white')};
    background: ${props => (props.theme.is === 'dark' ? 'white' : 'black')};
  }
`;

export default ImageMask;
