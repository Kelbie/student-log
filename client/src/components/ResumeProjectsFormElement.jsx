import React, { useState } from 'react';

import { faEllipsisV, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { rgba } from 'polished';
import styled from 'styled-components';

import { Button2 } from './Button';
import EditDropdown from './EditDropdown';

function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }

  return JSON.stringify(obj) === JSON.stringify({});
}

function FormElement({ handle, register, editable, errors, ...props }) {
  const [isEditable, setIsEditable] = useState(editable);
  const [editDropdownActive, setEditDropdownActive] = useState(false);

  return (
    <div {...props}>
      <div {...handle} className="handle">
        ::
      </div>
      <div className="content">
        <div className={`form ${!isEditable ? 'hidden' : ''}`}>
          <label>Project Name*</label>
          <input
            type="text"
            name={`projects[${props.index}].name`}
            ref={register({ required: true })}
            placeholder="Supreme Hacker"
          />
          {errors.name
            ? errors.name[props.index] && (
                <span id={`name${props.index}Error`}>This field is required</span>
              )
            : null}

          <label>Project Description</label>
          <input
            type="text"
            name={`projects[${props.index}].description`}
            ref={register}
            placeholder="A video chat app with great picture quality"
          />

          <label>Link to Project</label>
          <input
            type="text"
            name={`projects[${props.index}].link`}
            ref={register}
            placeholder="http://piperchat.com"
          />

          <div className="buttons">
            <Button2
              onClick={async () => {
                props.delete();
              }}
            >
              Delete
            </Button2>

            <Button2
              onClick={async () => {
                console.log(props.watch());
                const errors = await props.triggerValidation();
                console.log(923, errors);
                if (errors) {
                  setIsEditable(false);
                }
              }}
            >
              Save
            </Button2>
          </div>
        </div>
        <div className={`render ${isEditable ? 'hidden' : ''}`}>
          <div className="top">
            <div className="left">
              <div className="name">{props.watch(`projects[${props.index}].name`)}</div>
            </div>
            <div className="right">
              <div className="link">{props.watch(`projects[${props.index}].link`)}</div>
            </div>
          </div>
          <div className="bottom">{props.watch(`projects[${props.index}].description`)}</div>
        </div>
      </div>
      {!isEditable ? (
        <div
          className="edit"
          onClick={() => {
            setEditDropdownActive(!editDropdownActive);
          }}
        >
          <FontAwesomeIcon icon={faEllipsisV} />
          {editDropdownActive ? <EditDropdown setIsEditable={setIsEditable}></EditDropdown> : null}
        </div>
      ) : null}
    </div>
  );
}

export default styled(FormElement)`
  display: flex;
  align-items: center;

  .handle {
    color: ${props => props.theme.PRIMARY_COLOR};
    visibility: ${props => (props.handle ? 'visible' : 'hidden')};
    margin-right: 8px;
    font-family: 'Times New Roman';
  }

  .content {
    padding: 8px;
    flex-grow: 1;

    .form {
      * {
        display: block;
      }

      input {
        width: 100%;
        background: ${props => rgba(props.theme.PRIMARY_COLOR, 0.1)};
        padding: 4px;
        border: 1px solid ${props => props.theme.PRIMARY_COLOR};
        border-radius: 4px;
        color: #e5e5e5;
      }

      &.hidden {
        display: none;
      }

      .buttons {
        display: flex;
        margin-top: 8px;

        ${Button2}:first-child {
          margin-left: 0px;
        }

        ${Button2} {
          margin-left: 4px;
        }
      }
    }

    .render {
      .top {
        justify-content: space-between;
        align-items: center;

        display: flex;
      }

      &.hidden {
        display: none;
      }

      .name {
        font-size: 20px;
        font-weight: bold;
      }

      .left {
        text-align: left;
      }

      .right {
        text-align: right;
      }
    }
  }

  .edit {
    color: ${props => props.theme.PRIMARY_COLOR};
    margin-left: 8px;
    cursor: pointer;
  }
`;
