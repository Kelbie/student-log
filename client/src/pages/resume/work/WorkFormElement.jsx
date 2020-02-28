import React, { useState, useEffect } from 'react';

import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faTrash, faSave, faEdit } from '@fortawesome/free-solid-svg-icons';

import EditDropdown, { EditDropdownButton } from '../../../components/EditDropdown';
import Button, { Button2 } from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Label from '../../../components/common/Label';
import ButtonRefactor from '../../../components/common/ButtonRefactor';

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
          <Label required>Company Name</Label>
          <Input
            type="text"
            name={`work[${props.index}].name`}
            ref={register({ required: true })}
            placeholder="Google"
          />
          {errors.name
            ? errors.name[props.index] && (
                <span id={`name${props.index}Error`}>This field is required</span>
              )
            : null}

          <Label>Job Title</Label>
          <Input
            type="text"
            name={`work[${props.index}].title`}
            ref={register}
            placeholder="Software Engineer"
          />

          <Label>Job Location</Label>
          <Input
            type="text"
            name={`work[${props.index}].location`}
            ref={register}
            placeholder="Mountain View, CA"
          />

          <Label>Start Date</Label>
          <Input
            type="text"
            name={`work[${props.index}].start`}
            ref={register}
            placeholder="Sep 2015"
          />

          <Label>End Date</Label>
          <Input
            type="text"
            name={`work[${props.index}].end`}
            ref={register}
            placeholder="June 2019"
          />

          <div className="buttons">
            <ButtonRefactor
              type="button"
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
              type="submit"
              onClick={async () => {
                const errors = await props.triggerValidation();
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
          <div className="left">
            <div className="name">{props.watch(`work[${props.index}].name`)}</div>
            <div className="work">
              <span className="work">{props.watch(`work[${props.index}].title`)}</span>
            </div>
          </div>
          <div className="right">
            <div className="location">{props.watch(`work[${props.index}].location`)}</div>
            <div className="start-end">
              <span className="start">{props.watch(`work[${props.index}].start`)}</span>
              <span className="gap">
                {// If there is an end date then put the dash in
                props.watch(`work[${props.index}].end`) ? ' - ' : null}
              </span>
              <span className="end">{props.watch(`work[${props.index}].end`)}</span>
            </div>
          </div>
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

export default React.memo(styled(FormElement)`
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
      justify-content: space-between;
      align-items: center;

      display: flex;

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
`);
