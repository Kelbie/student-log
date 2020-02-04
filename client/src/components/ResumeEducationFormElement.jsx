import React, { useState } from 'react';

import { faEllipsisV, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { rgba } from 'polished';
import styled from 'styled-components';

import { Button2 } from './Button';
import EditDropdown from './EditDropdown';

function FormElement({ handle, content, register, editable, errors, ...props }) {
  const [isEditable, setIsEditable] = useState(editable);
  const [editDropdownActive, setEditDropdownActive] = useState(false);

  console.log(222, props.watch(`name[${props.index}]`));

  return (
    <div {...props}>
      <div {...handle} className="handle">
        ::
      </div>
      <div className="content">
        <div className={`form ${!isEditable ? 'hidden' : ''}`}>
          <label>School Name*</label>
          <input
            type="text"
            name={`education[${props.index}].name`}
            ref={register({ required: true })}
            placeholder="Stanford University"
          />
          {errors.name
            ? errors.name[props.index] && (
                <span id={`name${props.index}Error`}>This field is required</span>
              )
            : null}

          <label>School Location</label>
          <input
            type="text"
            name={`education[${props.index}].location`}
            ref={register}
            placeholder="Stanford, CA"
          />

          <label>Degree</label>
          <input
            type="text"
            name={`education[${props.index}].degree`}
            ref={register}
            placeholder="BS"
          />

          <label>Major</label>
          <input
            type="text"
            name={`education[${props.index}].major`}
            ref={register}
            placeholder="Computer Science"
          />

          <label>GPA</label>
          <input
            type="text"
            name={`education[${props.index}].gpa`}
            ref={register}
            placeholder="3.6"
          />

          <label>Start Date</label>
          <input
            type="text"
            name={`education[${props.index}].start`}
            ref={register}
            placeholder="Sep 2015"
          />

          <label>End Date</label>
          <input
            type="text"
            name={`education[${props.index}].end`}
            ref={register}
            placeholder="June 2019"
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
              type="submit"
              onClick={async () => {
                const errors = await props.triggerValidation();
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
          <div className="left">
            <div className="name">{props.watch(`education[${props.index}].name`)}</div>
            <div className="course">
              <span className="major">{props.watch(`education[${props.index}].major`)}</span>
              <span>
                {props.watch(`education[${props.index}].major`) &&
                props.watch(`education[${props.index}].degree`)
                  ? ', '
                  : null}
              </span>
              <span className="degree">{props.watch(`education[${props.index}].degree`)}</span>
            </div>
            {/* <div className="gpa">
                        {props.watch(`gpa[${props.index}]`)}
                    </div> */}
          </div>
          <div className="right">
            <div className="location">{props.watch(`education[${props.index}].location`)}</div>
            <div className="start-end">
              <span className="start">{props.watch(`education[${props.index}].start`)}</span>
              <span className="gap">
                {// If there is an end date then put the dash in
                props.watch(`education[${props.index}].end`) ? ' - ' : null}
              </span>
              <span className="end">{props.watch(`education[${props.index}].end`)}</span>
            </div>
          </div>
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
`;
