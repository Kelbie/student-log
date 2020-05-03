import React, { useState, useEffect } from 'react';

// Styling
import styled, { withTheme } from 'styled-components';

// Redux
import { useDispatch } from 'redux-react-hook';
import { setColorTheme } from '../actions/actions';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircle } from '@fortawesome/free-solid-svg-icons';

function ThemePicker(props) {
  const dispatch = useDispatch();

  const [picked, setPicked] = useState(props.theme.PRIMARY_COLOR);
  useEffect(() => {
    // when picked changes update theme.
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

export default ThemePicker;
