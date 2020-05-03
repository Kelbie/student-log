import React, { useState } from 'react';

// Icons
import {
  faSave,
  faTrash,
  faEdit
} from '@fortawesome/free-solid-svg-icons';

// Styling
import styled from 'styled-components';

// Common
import { Button2 } from '../../../components/common/Button';
import ButtonRefactor from '../../../components/common/ButtonRefactor';
import Label from '../../../components/common/Label';
import Input from '../../../components/common/Input';
import EditDropdown, { EditDropdownButton } from '../../../components/common/EditDropdown';


function FormElement({ handle, content, register, editable, errors, ...props }) {
  const [isEditable, setIsEditable] = useState(editable);

  return (
    <div {...props}>
      <div {...handle} className="handle">
        ::
      </div>
      <div className="content">
        <div className={`form ${!isEditable ? 'hidden' : ''}`}>
          <Label required>Award Name</Label>
          <Input
            type="text"
            name={`awards[${props.index}].name`}
            ref={register({ required: true })}
            placeholder="Supreme Hacker"
          />
          {errors.name
            ? errors.name[props.index] && (
                <span id={`name${props.index}Error`}>This field is required</span>
              )
            : null}

          <Label>Award Date</Label>
          <Input
            type="text"
            name={`awards[${props.index}].date`}
            ref={register}
            placeholder="May 2015"
          />

          <Label>Awarder</Label>
          <Input
            type="text"
            name={`awards[${props.index}].awarder`}
            ref={register}
            placeholder="HackNY"
          />

          <Label>Summary</Label>
          <Input
            type="text"
            name={`awards[${props.index}].summary`}
            ref={register}
            placeholder="Recognized for creating the most awesome project at a hackathon"
          />

          <div type="submit" className="buttons">
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
              type="submit"
              icon={faSave}
              variant={'fill'}
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
          <div className="top">
            <div className="left">
              <div className="name">{props.watch(`awards[${props.index}].name`)}</div>
              <div className="course">
                <span className="major">{props.watch(`awards[${props.index}].awarder`)}</span>
                <span className="degree">{props.watch(`awards[${props.index}].degree`)}</span>
              </div>
            </div>
            <div className="right">
              <div className="location">{props.watch(`awards[${props.index}].location`)}</div>
              <div className="start-end">{props.watch(`awards[${props.index}].date`)}</div>
            </div>
          </div>
          <div className="bottom">{props.watch(`awards[${props.index}].summary`)}</div>
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

// Memoized to improve performance
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
`);
