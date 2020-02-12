import React, { useState, ReactElement, ReactNode } from 'react';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import Button from './common/Button';

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
      <Button type="button" icon={props.icon} className={className} onClick={onClick}>
        {children}
      </Button>
    );
  }
)``;

function EditDropdown({ children, ...props }: IProps) {
  const [active, setActive] = useState<Boolean>(false);
  return (
    <div {...props}>
      <Button type="button" icon={faEllipsisV} onClick={() => setActive(!active)}></Button>
      {active ? <div className="options">{children}</div> : null}
    </div>
  );
}

export default styled(EditDropdown)`
  color: ${props => props.theme.PRIMARY_COLOR};
  cursor: pointer;
  position: relative;

  .options {
    position: absolute;
    right: 0;
  }
`;
