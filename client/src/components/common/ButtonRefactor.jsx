import React from 'react';

// Styling
import styled, { css } from 'styled-components';
import { rgba, darken } from 'polished';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Button({ type, variant, icon, children, className, onClick, disabled }) {
  return (
    <button type={type} className={className} onClick={onClick} disabled={disabled}>
      <span className="icon">
        <FontAwesomeIcon icon={icon} />
      </span>
      <span className="text">{children}</span>
    </button>
  );
}

export default styled(Button)`
  white-space: nowrap;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  appearance: none;
  border: none;
  font-size: 16px;
  padding: 12px;
  border-radius: 999999px;
  display: flex;
  background: transparent;

  transition: 0.15s ease 0s;

  @media only screen and (max-width: 480px) {
    .text {
      display: none;
    }
  }

  * {
    transition: 0.15s ease 0s;
  }

  .icon {
    position: relative;
    svg,
    path {
      color: ${props =>
        props.variant === 'fill' ? props.theme.PALLET['100'] : props.theme.PALLET['400']};
    }
  }
  .text {
    color: ${props => props.theme.PALLET['100']};
    margin-left: ${props => (props.children ? '8px' : '0px')};
  }

  &:hover {
    background: ${props =>
      props.disabled ? 'transparent' : rgba(props.theme.PRIMARY_COLOR, 0.05)};

    .icon {
      svg,
      path {
        position: sticky;
        color: ${props =>
          props.disabled ? rgba(props.theme.PRIMARY_COLOR, 0.5) : props.theme.PRIMARY_COLOR};
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .text {
      color: ${props =>
        props.disabled ? rgba(props.theme.PRIMARY_COLOR, 0.5) : props.theme.PRIMARY_COLOR};
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
          color: ${props =>
            props.disabled ? rgba(props.theme.PRIMARY_COLOR, 0.5) : props.theme.PRIMARY_COLOR};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }

      .text {
        color: ${props =>
          props.disabled ? rgba(props.theme.PRIMARY_COLOR, 0.5) : props.theme.PRIMARY_COLOR};
      }

      box-shadow: inset 0px 0px 0px 1px
        ${props =>
          props.disabled ? rgba(props.theme.PRIMARY_COLOR, 0.5) : props.theme.PRIMARY_COLOR};

      &:hover {
        box-shadow: inset 0px 0px 0px 1.2px
          ${props =>
            props.disabled ? rgba(props.theme.PRIMARY_COLOR, 0.5) : props.theme.PRIMARY_COLOR};
      }
    `}
`;
