import React from 'react';

import styled from 'styled-components';
import { rgba, darken } from 'polished';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faBriefcase, faComments } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import { useWindowSize, useWindowWidth, useWindowHeight } from '@react-hook/window-size';

function Button({ type, ...props }) {
  console.log(999, type, props);
  // const width = useWindowWidth();

  if (props.to) {
    return (
      <Link to={props.to} {...props}>
        <button type={'button'} className={props.variant}>
          <span className="icon">
            <FontAwesomeIcon icon={props.icon} />
          </span>
          <span className="text">{props.children}</span>
        </button>
      </Link>
    );
  } else {
    return (
      <div to={props.to} {...props}>
        <button type={props.type} className={props.variant}>
          <span className="icon">
            <FontAwesomeIcon icon={props.icon} />
          </span>
          <span className="text">{props.children}</span>
        </button>
      </div>
    );
  }
}

Button = styled(Button)`
  cursor: pointer;
  text-decoration: none;

  @media only screen and (max-width: 480px) {
    .text {
      display: none;
    }
  }

  button {
    white-space: nowrap;
    cursor: pointer;
    appearance: none;
    border: none;
    font-size: 16px;
    padding: 12px;
    border-radius: 999999px;
    display: flex;
    background: transparent;

    &.fill {
      background: -webkit-linear-gradient(
        ${props => props.theme.PRIMARY_COLOR},
        ${props => darken(0.1, props.theme.PRIMARY_COLOR)}
      );
    }

    transition: 0.15s ease 0s;
    * {
      transition: 0.15s ease 0s;
    }

    .icon {
      position: relative;
      svg,
      path {
        color: ${props =>
          props.active
            ? props.theme.PRIMARY_COLOR
            : props.variant === 'fill'
            ? props.theme.PALLET['100']
            : props.theme.is === 'dark'
            ? props.theme.PALLET['400']
            : props.theme.PALLET['600']};
      }
    }
    .text {
      color: ${props =>
        props.active
          ? props.theme.PRIMARY_COLOR
          : props.variant === 'fill'
          ? props.theme.PALLET['100']
          : props.theme.is === 'dark'
          ? props.theme.PALLET['400']
          : props.theme.PALLET['600']};
      margin-left: ${props => (props.children ? '8px' : '0px')};
    }
  }
  &:hover > button {
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
      position: sticky;
      background: -webkit-linear-gradient(
        ${props => props.theme.PRIMARY_COLOR},
        ${props => props.theme.SECONDARY_COLOR}
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
`;

function Button2Component(props) {
  return <button {...props}>{props.children}</button>;
}

Button2Component = styled(Button2Component)`
  background: -webkit-linear-gradient(
    ${props => props.theme.PRIMARY_COLOR},
    ${props => darken(0.1, props.theme.PRIMARY_COLOR)}
  );
  border: none;
  padding: 12px;
  color: ${props => props.theme.PALLET['100']};
  font-weight: bold;
  cursor: pointer;
  border-radius: 9999999px;
`;

function Button2LinkComponent(props) {
  return (
    <Link to={props.to} {...props}>
      <div>{props.children}</div>
    </Link>
  );
}

Button2LinkComponent = styled(Button2LinkComponent)`
  text-align: center;
  div {
    font-size: 12px;
    background: -webkit-linear-gradient(
      ${props => props.theme.PRIMARY_COLOR},
      ${props => darken(0.1, props.theme.PRIMARY_COLOR)}
    );
    border: none;
    padding: 12px;
    color: ${props => props.theme.PALLET['100']};
    font-weight: bold;
    cursor: pointer;
    border-radius: 4px;
    width: 100%;
    cursor: pointer;
    text-decoration: none;
  }
`;

function ButtonExternalComponent(props) {
  return (
    <a href={props.href} {...props}>
      <div type={`button`} className={props.variant}>
        <span className="icon">
          <FontAwesomeIcon icon={props.icon} />
        </span>
        <span className="text">{props.children}</span>
      </div>
    </a>
  );
}

ButtonExternalComponent = styled(ButtonExternalComponent)`
  width: 100%;
  cursor: pointer;
  text-decoration: none;

  @media only screen and (max-width: 480px) {
    .text {
      display: none;
    }
  }

  div {
    cursor: pointer;
    appearance: none;
    border: none;
    font-size: 16px;
    padding: 12px;
    border-radius: 999999px;
    display: flex;
    background: transparent;

    &.fill {
      background: -webkit-linear-gradient(
        ${props => props.theme.PRIMARY_COLOR},
        ${props => darken(0.1, props.theme.PRIMARY_COLOR)}
      );
    }

    transition: 0.15s ease 0s;
    * {
      transition: 0.15s ease 0s;
    }

    .icon {
      position: relative;
      svg,
      path {
        position: sticky;
        color: ${props =>
          props.active
            ? props.theme.PRIMARY_COLOR
            : props.theme.is === 'dark'
            ? 'white'
            : '#939399'};
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
    .text {
      white-space: nowrap;
      position: sticky;
      background: -webkit-linear-gradient(
        ${props =>
          props.active
            ? props.theme.PRIMARY_COLOR
            : props.theme.is === 'dark'
            ? 'white'
            : '#939399'},
        ${props =>
          props.active
            ? props.theme.SECONDARY_COLOR
            : props.theme.is === 'dark'
            ? 'white'
            : '#939399'}
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: ${props =>
        props.active ? 'transparent' : props.theme.is === 'dark' ? 'white' : '#939399'};
      margin-left: ${props => (props.children ? '8px' : '0px')};
    }
  }
  &:hover > div {
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
      position: sticky;
      background: -webkit-linear-gradient(
        ${props => props.theme.PRIMARY_COLOR},
        ${props => props.theme.SECONDARY_COLOR}
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
`;

export default Button;

export const Button2 = Button2Component;

export const ButtonLink2 = Button2LinkComponent;

export const ButtonExternal = ButtonExternalComponent;
