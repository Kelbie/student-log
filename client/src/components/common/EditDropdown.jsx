import React, { useState } from 'react';

// Styling
import styled from 'styled-components';

// Icons
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

import ButtonRefactor from './ButtonRefactor';

export const EditDropdownButton = styled(({ children, className, onClick, ...props }) => {
  return (
    <ButtonRefactor
      type="button"
      variant="default"
      icon={props.icon}
      className={className}
      onClick={onClick}
    >
      {children}
    </ButtonRefactor>
  );
})``;

function EditDropdown({ children, ...props }) {
  const [active, setActive] = useState(false);
  return (
    <div {...props}>
      <ButtonRefactor
        variant="default"
        type="button"
        icon={faEllipsisV}
        onClick={() => setActive(!active)}
      ></ButtonRefactor>
      {active ? <div className="options">{children}</div> : null}
    </div>
  );
}

export default styled(EditDropdown)`
  color: ${props => props.theme.PRIMARY_COLOR};
  cursor: pointer;
  position: relative;

  .options {
    display: flex;
    flex-direction: column;
    box-shadow: ${props => props.theme.PRIMARY_COLOR} 0px 0px 0px 1px inset;
    position: absolute;
    top: 0;
    right: 32px;
    border-radius: 21px;
    overflow: hidden;
    background: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['900'] : props.theme.PALLET['400']};
    ${ButtonRefactor} {
      border-radius: 0px;
    }
  }
`;
