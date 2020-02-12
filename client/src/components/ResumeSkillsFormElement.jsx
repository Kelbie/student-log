import React, { useState, useEffect } from 'react';

import move from 'lodash-move';

import { Draggable } from 'react-beautiful-dnd';

import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faPlus, faTrash, faSave, faEdit } from '@fortawesome/free-solid-svg-icons';

import DraggableForm from './DraggableForm';
import EditDropdown, { EditDropdownButton } from './EditDropdown';
import Input from './common/Input';
import Button, { Button2 } from './common/Button';
import Label from './common/Label';

function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }

  return JSON.stringify(obj) === JSON.stringify({});
}

const getItemStyle = (isDragging, draggableStyle) => {
  const { transform } = draggableStyle;
  let activeTransform = {};
  if (transform) {
    activeTransform = {
      transform: `translate(0, ${transform.substring(
        transform.indexOf(',') + 1,
        transform.indexOf(')')
      )})`
    };
  }
  return {
    ...draggableStyle,
    ...activeTransform
  };
};

function Skill({ handle, register, ...props }) {
  return (
    <div {...props}>
      <div {...handle} className="handle">
        ::
      </div>
      <Input
        type="text"
        name={`skills[${props.parentIndex}].keywords[${props.index}]`}
        ref={register}
        placeholder="test"
      />
    </div>
  );
}

Skill = styled(Skill)`
  display: flex;
  align-items: center;

  .handle {
    margin-right: 8px;
  }
`;

function FormElement({ handle, register, editable, errors, ...props }) {
  const [isEditable, setIsEditable] = useState(editable);
  const [editDropdownActive, setEditDropdownActive] = useState(false);

  const [items, setItems] = useState([
    {
      id: `item-0`,
      isFixed: false,
      isEditable: false
    }
  ]);

  return (
    <div {...props}>
      <div {...handle} className="handle">
        ::
      </div>
      <div className="content">
        <div className={`form ${!isEditable ? 'hidden' : ''}`}>
          <Label required>Skill Name</Label>
          <Input
            type="text"
            name={`skills[${props.index}].name`}
            ref={register({ required: true })}
            placeholder="Supreme Hacker"
          />
          <Label>Skill Details</Label>
          <div className="skill-container">
            <DraggableForm
              items={items}
              setItems={setItems}
              onDragEnd={(start, end) => {
                setItems(move(items, start, end));
              }}
            >
              {items.map((item, index) => {
                return (
                  <Draggable
                    key={item.id}
                    draggableId={item.id}
                    index={index}
                    direction={'vertical'}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                      >
                        <Skill
                          register={register}
                          parentIndex={props.index}
                          index={item.id.split('-')[1]}
                          handle={item.isFixed === false ? provided.dragHandleProps : false}
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}
            </DraggableForm>
            <Button
              icon={faPlus}
              variant={'outline'}
              onClick={() => {
                setItems([
                  ...items,
                  {
                    id: `item-${items.length}`,
                    isFixed: false,
                    isEditable: true
                  }
                ]);
              }}
            ></Button>
          </div>

          <div className="buttons">
            <Button
              icon={faTrash}
              onClick={async () => {
                props.delete();
              }}
            >
              Delete
            </Button>

            <Button
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
            </Button>
          </div>
        </div>
        <div className={`render ${isEditable ? 'hidden' : ''}`}>
          <div className="top">
            <div className="name">{props.watch(`skills[${props.index}].name`)}</div>
          </div>
          <div className="bottom">{props.watch(`skills[${props.index}].keywords`)?.join(', ')}</div>
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
      &.hidden {
        display: none;
      }

      .name {
        font-size: 20px;
        font-weight: bold;
      }
    }
  }

  .skill-container {
    display: flex;
    align-items: flex-end;
    align-content: flex-end;

    ${Button2} {
      padding: 4px;
      border-radius: 100px;
      width: 22px;
      margin-left: 4px;
      margin-bottom: 4px;
    }

    > div {
      flex-grow: 1;
      > div {
        margin-bottom: 4px;
      }
    }
  }
`;
