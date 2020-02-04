import React from 'react';

import styled from 'styled-components';

import date from 'date-and-time';

import ImageMask from './ImageMask';

function Gap(props) {
  return (
    <div {...props}>
      <div className="stripes">
        <div className="label">{props.duration} hour break</div>
      </div>
    </div>
  );
}

Gap = styled(Gap)`
  border-radius: 16px;
  grid-column: 2;
  text-transform: uppercase;
  border: 3px solid #3d3f52;
  position: relative;
  text-align: center;
  overflow: hidden;
  box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.3);

  .stripes {
    background: linear-gradient(to bottom right, #f89844, #de3959);
    background: repeating-linear-gradient(
      135deg,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0) 8px,
      #3d3f52 8px,
      #3d3f52 12px
    );
  }

  .label {
    display: inline-block;
    font-size: 12px;
    color: white;
    padding: 16px;
    margin: 16px;
    background: #24252d;
    border: 2px solid #3d3f52;
  }

  grid-row: span ${props => props.index};
`;

export default Gap;
