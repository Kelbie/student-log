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
        <div className="content">
            <div className={`form ${!isEditable ? 'hidden' : ''}`}>
                <label>Full Name</label>
                <input type="text" name={`name[${props.index}]`} ref={register} placeholder="John Smith" />

                <label>Email</label>
                <input type="text" name={`date[${props.index}]`} ref={register} placeholder="johnsmith@gmail.com" />

                <label>Phone Number</label>
                <input type="text" name={`awarder[${props.index}]`} ref={register} placeholder="(555) 123-4567" />

                <label>Location</label>
                <input type="text" name={`summary[${props.index}]`} ref={register} placeholder="New York, NY" />

                <label>Link</label>
                <input type="text" name={`summary[${props.index}]`} ref={register} placeholder="mycoolportfolio.com/myname" />

                <div className="buttons">
                    <Button2 onClick={async () => {
                        const errors = await props.triggerValidation();
                    }}>Save</Button2>
                </div>

            </div>
            <div className={`render ${isEditable ? 'hidden' : ''}`}>
                <div className="top">
                    <div className="left">
                        <div className="name">
                            {props.watch(`name[${props.index}]`)}
                        </div>
                        <div className="course">
                            <span className="major">
                                {props.watch(`awarder[${props.index}]`)}
                            </span>
                            <span className="degree">
                                {props.watch(`degree[${props.index}]`)}
                            </span>
                        </div>
                    </div>
                    <div className="right">
                        <div className="location">
                            {props.watch(`location[${props.index}]`)}
                        </div>
                        <div className="start-end">
                            {props.watch(`date[${props.index}]`)}
                        </div>
                    </div>
                </div>
                <div className="bottom">
                    {props.watch(`summary[${props.index}]`)}
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