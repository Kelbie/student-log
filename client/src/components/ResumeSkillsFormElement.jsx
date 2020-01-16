import React, { useState, useEffect } from "react";

import move from "lodash-move";

import { Draggable } from "react-beautiful-dnd";

import styled from "styled-components";

import {rgba} from "polished";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faGripVertical } from "@fortawesome/free-solid-svg-icons";

import DraggableForm from "./DraggableForm";
import EditDropdown from "./EditDropdown";
import { Button2 } from "./Button";

function isEmpty(obj) {
    for(var prop in obj) {
      if(obj.hasOwnProperty(prop)) {
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

function Skill({handle, register, ...props}) {
    return <div {...props}>
        <div {...handle} className="handle">
            ::
        </div>
        <input type="text" name={`skills[${props.parentIndex}].keywords[${props.index}]`} ref={register} placeholder="test" />
    </div>
}

Skill = styled(Skill)`
    display: flex;
    align-items: center;

    .handle {
        margin-right: 8px;
    }
`

function FormElement({handle, register, editable, errors, ...props}) {
    const [isEditable, setIsEditable] = useState(editable);
    const [editDropdownActive, setEditDropdownActive] = useState(false);

    const [items, setItems] = useState([
        {
            id: `item-0`,
            isFixed: false,
            isEditable: false
        }
    ])

    return <div {...props}>
        <div {...handle} className="handle">
            ::
        </div>
        <div className="content">
            <div className={`form ${!isEditable ? 'hidden' : ''}`}>
                <label>Skill Name*</label>
                <input type="text" name={`skills[${props.index}].name`} ref={register({required: true})} placeholder="Supreme Hacker" />
                <label>Skill Details</label>
                <div className="skill-container">

                    <DraggableForm items={items} setItems={setItems} onDragEnd={
                        (start, end) => {
                            setItems(move(items, start, end))
                        }
                    }>
                        {
                            items.map((item, index) => {
                                return <Draggable key={item.id} draggableId={item.id} index={index} direction={'vertical'}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                            )}
                                        >
                                            <Skill
                                                register={register}
                                                parentIndex={props.index}
                                                index={item.id.split("-")[1]} 
                                                handle={item.isFixed === false ? 
                                                    provided.dragHandleProps : false} />
                                        </div>
                                    )}
                                </Draggable>
                            })
                        }
                    </DraggableForm>
                    <Button2 onClick={() => {
                        setItems([...items, {
                            id: `item-${items.length}`,
                            isFixed: false,
                            isEditable: true
                        }])
                    }}>+</Button2>
                </div>

                <div className="buttons">

                    <Button2 onClick={async () => {
                        props.delete()
                    }}>Delete</Button2>

                    <Button2 type="submit" onClick={async () => {
                        const errors = await props.triggerValidation();
                        if (errors) {
                            setIsEditable(false);
                        }
                    }}>Save</Button2>
                </div>

            </div>
            <div className={`render ${isEditable ? 'hidden' : ''}`}>
                <div className="top">
                    <div className="name">
                        {props.watch(`skills[${props.index}].name`)}
                    </div>
                </div>
                <div className="bottom">
                    {
                        props.watch(`skills[${props.index}].keywords`)?.join(", ")
                    }
                </div>
            </div> 
        </div>
        {
            !isEditable ?
            <div className="edit" onClick={() => {
                setEditDropdownActive(!editDropdownActive);
            }}>
                <FontAwesomeIcon icon={faEllipsisV} />
                {
                    editDropdownActive ?
                        <EditDropdown setIsEditable={setIsEditable}></EditDropdown> : null
                }
            </div> : null
        }
    </div>
}

export default styled(FormElement)`
    display: flex;
    align-items: center;

    .handle {
        color: ${props => props.theme.PRIMARY_COLOR};
        visibility: ${props => props.handle ? 'visible' : 'hidden' };
        margin-right: 8px;
        font-family: "Times New Roman";
    }

    .content {
        padding: 8px;
        flex-grow: 1;

        .form {

            input {
                width: 100%;
                background: ${props => rgba(props.theme.PRIMARY_COLOR, 0.1)};
                padding: 4px;
                border: 1px solid ${props =>props.theme.PRIMARY_COLOR};
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

            &.hidden {
                display: none;
            }

            .name {
                font-size: 20px;
                font-weight: bold;
            }

        }
    }
    
    .edit {
        color: ${props => props.theme.PRIMARY_COLOR};
        margin-left: 8px;
        cursor: pointer;

    }

    .skill-container {
        display: flex;
        align-items:flex-end;
        align-content:flex-end;

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