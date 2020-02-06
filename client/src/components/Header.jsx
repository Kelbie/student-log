import React, { useCallback, useState, useEffect } from 'react';

import styled, { withTheme } from 'styled-components';

import { useDispatch } from 'redux-react-hook';
import { setColorTheme } from '../actions/actions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircle, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

import Switch from 'react-switch';

function ThemePicker(props) {
  const [picked, setPicked] = useState('blue');

  const dispatch = useDispatch();

  useEffect(() => {
    switch (picked) {
      case 'pink':
        dispatch(
          setColorTheme({
            PRIMARY_COLOR: '#FC8181',
            SECONDARY_COLOR: '#F56565'
          })
        );
        break;
      case 'blue':
        dispatch(
          setColorTheme({
            PRIMARY_COLOR: '#63B3ED',
            SECONDARY_COLOR: '#4299E1'
          })
        );
        break;
      case 'orange':
        dispatch(
          setColorTheme({
            PRIMARY_COLOR: '#F6AD55',
            SECONDARY_COLOR: '#ED8936'
          })
        );
        break;
      case 'green':
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
        <label onClick={() => setPicked('blue')}>
          <input type="radio" name="color" id="blue" defaultChecked />
          <div className="color">
            {picked === 'blue' ? (
              <FontAwesomeIcon icon={faCheckCircle} />
            ) : (
              <FontAwesomeIcon icon={faCircle} />
            )}
          </div>
        </label>
        <label onClick={() => setPicked('pink')}>
          <input type="radio" name="color" id="pink" />
          <div className="color">
            {picked === 'pink' ? (
              <FontAwesomeIcon icon={faCheckCircle} />
            ) : (
              <FontAwesomeIcon icon={faCircle} />
            )}
          </div>
        </label>
        <label onClick={() => setPicked('orange')}>
          <input type="radio" name="color" id="orange" />
          <div className="color">
            {picked === 'orange' ? (
              <FontAwesomeIcon icon={faCheckCircle} />
            ) : (
              <FontAwesomeIcon icon={faCircle} />
            )}
          </div>
        </label>
        <label onClick={() => setPicked('green')}>
          <input type="radio" name="color" id="green" />
          <div className="color">
            {picked === 'green' ? (
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

ThemePicker = styled(ThemePicker)`
  fieldset {
    display: flex;
    border: none;
  }
  #orange {
    & + div > svg {
      color: #f6ad55;
    }
  }

  #blue {
    & + div > svg {
      color: #63b3ed;
    }
  }

  #pink {
    & + div > svg {
      color: #fc8181;
    }
  }

  #green {
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
  }
`;

function Header(props) {
  const dispatch = useDispatch();
  const toggleTheme = useCallback(() => dispatch({ type: 'TOGGLE_THEME' }), []);

  const [checked, setChecked] = useState(false);

  return (
    <div {...props}>
      <h1>
        <span className="student">STUDENT</span>
        <span className="log">LOG</span>
      </h1>
      <div>
        <Switch
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
        />
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
