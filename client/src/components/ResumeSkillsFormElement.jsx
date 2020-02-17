import React, { useState, useEffect, useCallback } from 'react';

import move from 'lodash-move';

import { Draggable } from 'react-beautiful-dnd';

import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEllipsisV,
  faPlus,
  faTrash,
  faSave,
  faEdit,
  faMinus
} from '@fortawesome/free-solid-svg-icons';

import DraggableForm from './DraggableForm';
import EditDropdown, { EditDropdownButton } from './EditDropdown';
import Input from './common/Input';
import Button, { Button2 } from './common/Button';
import Label from './common/Label';
import ButtonRefactor from './common/ButtonRefactor';
import { useMappedState, useDispatch } from 'redux-react-hook';
import { saveResume } from '../actions/actions';

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
  const disabled = props.length > 1 ? false : true;
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
      <ButtonRefactor
        icon={faMinus}
        disabled={disabled}
        type={'button'}
        variant={'border'}
        onClick={() => props.delete(props.index)}
      ></ButtonRefactor>
    </div>
  );
}

Skill = styled(Skill)`
  display: flex;
  align-items: center;

  .handle {
    margin-right: 8px;
  }

  ${ButtonRefactor} {
    margin-bottom: 0px !important;
  }
`;

function FormElement({ handle, register, editable, errors, ...props }) {
  const [isEditable, setIsEditable] = useState(editable);
  const [editDropdownActive, setEditDropdownActive] = useState(false);

  const [numberOfDeletes, setNumberOfDeletes] = useState(1);

  console.log(props.skills, props.index, 123);
  // State for each item
  const [items, setItems] = useState(
    props.skills[props.parentIndex].keywords.map((keyword, i) => {
      return {
        id: `item-${i}`,
        isFixed: false,
        isEditable: false
      };
    })
  );

  useEffect(() => {
    console.log('items', items);
    props.setItems(items);
  }, [items]);

  // Dispatch on save
  const dispatch = useDispatch();

  function del(id) {
    setNumberOfDeletes(numberOfDeletes + 1);
    let index = -1;
    setItems([
      ...items.filter(item_ => {
        console.log(9832, item_.id, id);
        if (item_.id.split('-')[1] !== id) {
          return true;
        } else {
          index = id;
        }
      })
    ]);

    let absoluteIndex = -1;
    items.map((item, i) => {
      if (item.id === index) {
        absoluteIndex = i;
      }
    });

    console.log(871927397, absoluteIndex, index, props.index, id);

    dispatch(
      saveResume({
        skills: props.skills.map((skill, i) => {
          if (props.index == i) {
            return {
              ...skill,
              keywords: skill.keywords.filter((keyword, j) => {
                return j != id;
              })
            };
          } else {
            return skill;
          }
        })
      })
    );
  }

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
                dispatch(
                  saveResume({
                    skills: [
                      ...props.skills.map((skill, i) => {
                        if (i != props.index) {
                          return skill;
                        } else {
                          return {
                            ...skill,
                            keywords: move(skill.keywords, start, end)
                          };
                        }
                      })
                    ]
                  })
                );
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
                          length={items.length}
                          watch={props.watch}
                          delete={id => del(id)}
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
            <ButtonRefactor
              icon={faPlus}
              type={'button'}
              variant={'border'}
              onClick={() => {
                // console.log(98172873, items);
                setItems([
                  ...items,
                  {
                    id: `item-${items.length * numberOfDeletes}`,
                    content: 'new item',
                    isFixed: false,
                    isEditable: true
                  }
                ]);
                console.log(
                  [
                    ...props.skills.map((skill, i) => {
                      if (i != props.index) {
                        return skill;
                      } else {
                        return {
                          ...skill,
                          keywords: [...skill.keywords, '']
                        };
                      }
                    })
                  ],
                  98172873
                );
                dispatch(
                  saveResume({
                    skills: [
                      ...props.skills.map((skill, i) => {
                        if (i != props.index) {
                          return skill;
                        } else {
                          return {
                            ...skill,
                            keywords: [...skill.keywords, '']
                          };
                        }
                      })
                    ]
                  })
                );
              }}
            ></ButtonRefactor>
          </div>

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
              type="submit"
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
            <div className="name">{props.watch(`skills[${props.index}].name`)}</div>
          </div>
          <div className="bottom">
            {props
              .watch(`skills[${props.index}].keywords`)
              ?.filter(keyword => {
                return keyword != undefined || keyword != null;
              })
              ?.join(', ')}
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

    ${ButtonRefactor} {
      padding: 6px;
      margin-left: 8px;
      margin-bottom: 8px;

      .icon {
        margin: 0px 2px;
      }
    }

    > div {
      flex-grow: 1;
      > div {
        padding: 8px 0px;
      }
    }
  }
`;
