import React, { useState } from 'react';

import {
  faEllipsisV,
  faGripVertical,
  faTrash,
  faSave,
  faEdit
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { rgba } from 'polished';
import styled from 'styled-components';

import Button, { Button2 } from './common/Button';
import EditDropdown, { EditDropdownButton } from './EditDropdown';
import Input from './common/Input';
import Label from './common/Label';
import ButtonRefactor from './common/ButtonRefactor';

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
          <Label required>Project Name</Label>
          <Input
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

          <Label>Project Description</Label>
          <Input
            type="text"
            name={`projects[${props.index}].description`}
            ref={register}
            placeholder="A video chat app with great picture quality"
          />

          <Label>Link to Project</Label>
          <Input
            type="text"
            name={`projects[${props.index}].link`}
            ref={register}
            placeholder="http://piperchat.com"
          />

          <div className="buttons">
            <ButtonRefactor
              icon={faTrash}
              onClick={async () => {
                props.delete();
              }}
            >
              Delete
            </ButtonRefactor>

            <ButtonRefactor
              icon={faSave}
              variant={'fill'}
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
            </ButtonRefactor>
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
        <EditDropdown>
          <EditDropdownButton icon={faEdit} onClick={() => setIsEditable(!isEditable)}>
            Edit
          </EditDropdownButton>
          <EditDropdownButton icon={faTrash} onClick={() => props.delete()}>
            Delete
          </EditDropdownButton>
        </EditDropdown>
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
        justify-content: flex-end;
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
