import React from 'react';

import styled from 'styled-components';

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
  border: 3px solid
    ${props => (props.theme.is === 'dark' ? props.theme.PALLET['800'] : props.theme.PALLET['200'])};
  position: relative;
  text-align: center;
  overflow: hidden;
  box-shadow: 0px 0px 16px 0px
    ${props => (props.theme.is === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(192, 192, 192, 0.3)')};

  .stripes {
    /* background: linear-gradient(to bottom right, #f89844, #de3959); */
    background: repeating-linear-gradient(
      135deg,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0) 8px,
      ${props =>
          props.theme.is === 'dark' ? props.theme.PALLET['800'] : props.theme.PALLET['200']}
        8px,
      ${props =>
          props.theme.is === 'dark' ? props.theme.PALLET['800'] : props.theme.PALLET['200']}
        12px
    );
  }

  .label {
    display: inline-block;
    font-size: 12px;
    color: white;
    padding: 16px;
    margin: 16px;
    background: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['700'] : props.theme.PALLET['100']};
    border: 3px solid
      ${props =>
        props.theme.is === 'dark' ? props.theme.PALLET['800'] : props.theme.PALLET['200']};
  }

  grid-row: span ${props => props.index};
`;

export default Gap;
