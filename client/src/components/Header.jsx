import React, { useCallback, useState, useEffect } from 'react';

import styled, { withTheme } from 'styled-components';

import { useDispatch } from 'redux-react-hook';
import { setColorTheme } from '../actions/actions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircle, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

import Switch from 'react-switch';

function ThemePicker(props) {
  const [picked, setPicked] = useState(props.theme.PRIMARY_COLOR);

  const dispatch = useDispatch();

  useEffect(() => {
    switch (picked) {
      case '#FC8181':
        dispatch(
          setColorTheme({
            PRIMARY_COLOR: '#FC8181',
            SECONDARY_COLOR: '#F56565'
          })
        );
        break;
      case '#63B3ED':
        dispatch(
          setColorTheme({
            PRIMARY_COLOR: '#63B3ED',
            SECONDARY_COLOR: '#4299E1'
          })
        );
        break;
      case '#F6AD55':
        dispatch(
          setColorTheme({
            PRIMARY_COLOR: '#F6AD55',
            SECONDARY_COLOR: '#ED8936'
          })
        );
        break;
      case '#68D391':
        dispatch(
          setColorTheme({
            PRIMARY_COLOR: '#68D391',
            SECONDARY_COLOR: '#48BB78'
          })
        );
        break;
    }
  }, [picked]);

  return (
    <div {...props}>
      <fieldset>
        <label onClick={() => setPicked('#FC8181')}>
          <input type="radio" name="color" id="_FC8181" defaultChecked />
          <div className="color">
            {picked === '#FC8181' ? (
              <FontAwesomeIcon icon={faCheckCircle} />
            ) : (
              <FontAwesomeIcon icon={faCircle} />
            )}
          </div>
        </label>
        <label onClick={() => setPicked('#63B3ED')}>
          <input type="radio" name="color" id="_63B3ED" />
          <div className="color">
            {picked === '#63B3ED' ? (
              <FontAwesomeIcon icon={faCheckCircle} />
            ) : (
              <FontAwesomeIcon icon={faCircle} />
            )}
          </div>
        </label>
        <label onClick={() => setPicked('#F6AD55')}>
          <input type="radio" name="color" id="_F6AD55" />
          <div className="color">
            {picked === '#F6AD55' ? (
              <FontAwesomeIcon icon={faCheckCircle} />
            ) : (
              <FontAwesomeIcon icon={faCircle} />
            )}
          </div>
        </label>
        <label onClick={() => setPicked('#68D391')}>
          <input type="radio" name="color" id="_68D391" />
          <div className="color">
            {picked === '#68D391' ? (
              <FontAwesomeIcon icon={faCheckCircle} />
            ) : (
              <FontAwesomeIcon icon={faCircle} />
            )}
          </div>
        </label>
      </fieldset>
    </div>
  );
}

ThemePicker = styled(withTheme(ThemePicker))`
  fieldset {
    display: flex;
    border: none;
  }
  #_F6AD55 {
    & + div > svg {
      color: #f6ad55;
    }
  }

  #_63B3ED {
    & + div > svg {
      color: #63b3ed;
    }
  }

  #_FC8181 {
    & + div > svg {
      color: #fc8181;
    }
  }

  #_68D391 {
    & + div > svg {
      color: #68d391;
    }
  }

  .color {
    cursor: pointer;
    display: block;
    font-size: 20px;
    /* width: 16px;
        height: 16px; */
    /* border-radius: 100%; */
  }
  input {
    visibility: hidden;
    position: absolute;
    display: inline-block;
  }
`;

function Header(props) {
  const dispatch = useDispatch();
  const toggleTheme = useCallback(() => dispatch({ type: 'TOGGLE_THEME' }), []);

  const [checked, setChecked] = useState(props.theme.is === 'dark');

  return (
    <div {...props}>
      <h1>
        <span className="student">STUDENT</span>
        <span className="log">LOG</span>
      </h1>
      <div>
        {/* <Switch
          height={20}
          width={40}
          offColor={props.theme.SECONDARY_COLOR}
          onColor={props.theme.PRIMARY_COLOR}
          onChange={() => {
            toggleTheme();
            setChecked(!checked);
          }}
          checked={checked}
          checkedIcon={<FontAwesomeIcon icon={faMoon} />}
          uncheckedIcon={<FontAwesomeIcon icon={faSun} />}
        /> */}
        <ThemePicker />
      </div>
    </div>
  );
}

Header = styled(Header)`
  width: 100vw;
  /* background: #24252D; */
  /* box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.02); */

  width: 100%;
  max-width: 800px;
  margin: auto;
  padding: 24px 0px 8px 12px !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: auto !important;

  ${Switch} {
    cursor: pointer;

    .react-switch-bg > div {
      display: flex;
      align-items: center;
    }

    svg {
      width: 90%;
      height: 90%;
      margin: auto;
    }
  }

  h1 {
    /* padding: 0px 12px 4px 12px; */
    font-size: 20px;
    color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['400'] : props.theme.PALLET['600']};

    /* @media only screen and (max-width: 480px) {
            display: ;
        } */

    span.log {
      font-weight: 600;
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

export default withTheme(Header);
