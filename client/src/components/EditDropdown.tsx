import React, { useState, ReactElement, ReactNode } from 'react';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import Button from './common/Button';
import ButtonRefactor from './common/ButtonRefactor';

interface IProps {
  children: ReactNode;
  className: any;
  onClick: any;
  icon: any;
  // any other props that come into the component
}

export const EditDropdownButton = styled(
  ({ children, className, onClick, ...props }: IProps): ReactElement => {
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
  }
)``;

function EditDropdown({ children, ...props }: IProps) {
  const [active, setActive] = useState<Boolean>(false);
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
      props.theme.is === 'dark' ? props.theme.PALLET['800'] : props.theme.PALLET['100']};
    ${ButtonRefactor} {
      border-radius: 0px;
    }
  }
`;
