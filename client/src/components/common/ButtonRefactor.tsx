import React, { ReactNode } from 'react';

import styled, { css } from 'styled-components';
import { rgba, darken } from 'polished';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faBriefcase, faComments } from '@fortawesome/free-solid-svg-icons';

import { useWindowSize, useWindowWidth, useWindowHeight } from '@react-hook/window-size';
import { FontawesomeObject, IconProp, IconName } from '@fortawesome/fontawesome-svg-core';

interface IProps extends React.ComponentProps<'button'> {
  variant: 'fill' | 'border';
  icon: IconProp;
}

function Button({ type, variant, icon, children, className, onClick, ...props }: IProps) {
  return (
    <button type={type} className={className} onClick={onClick}>
      <span className="icon">
        <FontAwesomeIcon icon={icon} />
      </span>
      <span className="text">{children}</span>
    </button>
  );
}

export default styled(Button)`
  white-space: nowrap;
  cursor: pointer;
  appearance: none;
  border: none;
  font-size: 16px;
  padding: 12px;
  border-radius: 999999px;
  display: flex;
  background: transparent;

  transition: 0.15s ease 0s;
  * {
    transition: 0.15s ease 0s;
  }

  .icon {
    position: relative;
    svg,
    path {
      color: ${props => props.theme.PALLET['100']};
    }
  }
  .text {
    color: ${props => props.theme.PALLET['100']};
    margin-left: ${props => (props.children ? '8px' : '0px')};
  }

  &:hover {
    background: ${props => rgba(props.theme.PRIMARY_COLOR, 0.05)};

    .icon {
      svg,
      path {
        position: sticky;
        color: ${props => props.theme.PRIMARY_COLOR};
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .text {
      color: ${props => props.theme.PRIMARY_COLOR};
    }
  }

  ${props =>
    props.variant === 'fill' &&
    css`
      background: ${props => props.theme.PRIMARY_COLOR};
      &:hover {
        .icon {
          svg,
          path {
            position: sticky;
            color: ${props => props.theme.PALLET['200']};
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
        .text {
          color: ${props => props.theme.PALLET['200']};
        }
        background: ${props => darken(0.1, props.theme.PRIMARY_COLOR)};
      }
    `}

  ${props =>
    props.variant === 'border' &&
    css`
      .icon {
        svg,
        path {
          position: sticky;
          color: ${props => props.theme.PRIMARY_COLOR};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }

      .text {
        color: ${props => props.theme.PRIMARY_COLOR};
      }

      box-shadow: inset 0px 0px 0px 1px ${props => props.theme.PRIMARY_COLOR};

      &:hover {
        box-shadow: inset 0px 0px 0px 1.2px ${props => props.theme.PRIMARY_COLOR};
      }
    `}
`;
