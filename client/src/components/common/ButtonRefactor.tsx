import React, { ReactNode } from 'react';

import styled from 'styled-components';
import { rgba, darken } from 'polished';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faBriefcase, faComments } from '@fortawesome/free-solid-svg-icons';

import { useWindowSize, useWindowWidth, useWindowHeight } from '@react-hook/window-size';
import { FontawesomeObject, IconProp, IconName } from '@fortawesome/fontawesome-svg-core';

interface IProps extends React.ComponentProps<'button'> {
  variant: 'fill' | 'border';
  icon: IconProp;
}

function Button({ type, variant, icon, children, ...props }: IProps) {
  return (
    <button type={type} className={variant}>
      <span className="icon">
        <FontAwesomeIcon icon={icon} />
      </span>
      <span className="text">{children}</span>
    </button>
  );
}

export default Button;
