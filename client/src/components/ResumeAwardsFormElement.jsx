import React, { useState, useEffect } from "react";

import styled from "styled-components";

import {rgba} from "polished";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faGripVertical } from "@fortawesome/free-solid-svg-icons";

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

function FormElement({handle, content, register, editable, errors, ...props}) {
    const [isEditable, setIsEditable] = useState(editable);
    const [editDropdownActive, setEditDropdownActive] = useState(false);

    console.log(222, props.watch(`name[${props.index}]`));

    return <div {...props}>
        <div {...handle} className="handle">
            <FontAwesomeIcon icon={faGripVertical}  />
        </div>
        <div className="content">
            <div className={`form ${!isEditable ? 'hidden' : ''}`}>
                <label>Award Name*</label>
                <input type="text" name={`awards[${props.index}].name`} ref={register({required: true})} placeholder="Supreme Hacker" />
                {
                    errors.name ? 
                        errors.name[props.index] && <span id={`name${props.index}Error`}>This field is required</span>
                        : null
                }

                <label>Award Date</label>
                <input type="text" name={`awards[${props.index}].date`} ref={register} placeholder="May 2015" />

                <label>Awarder</label>
                <input type="text" name={`awards[${props.index}].awarder`} ref={register} placeholder="HackNY" />

                <label>Summary</label>
                <input type="text" name={`awards[${props.index}].summary`} ref={register} placeholder="Recognized for creating the most awesome project at a hackathon" />

                <div type="submit" className="buttons">
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
                    <div className="left">
                        <div className="name">
                            {props.watch(`awards[${props.index}].name`)}
                        </div>
                        <div className="course">
                            <span className="major">
                                {props.watch(`awards[${props.index}].awarder`)}
                            </span>
                            <span className="degree">
                                {props.watch(`awards[${props.index}].degree`)}
                            </span>
                        </div>
                    </div>
                    <div className="right">
                        <div className="location">
                            {props.watch(`awards[${props.index}].location`)}
                        </div>
                        <div className="start-end">
                            {props.watch(`awards[${props.index}].date`)}
                        </div>
                    </div>
                </div>
                <div className="bottom">
                    {props.watch(`awards[${props.index}].summary`)}
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