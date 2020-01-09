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

    return <div {...props}>
        <div {...handle} className="handle">
            <FontAwesomeIcon icon={faGripVertical}  />
        </div>
        <div className="content">
            <div className={`form ${!isEditable ? 'hidden' : ''}`}>
                <label>School Name*</label>
                <input type="text" name={`name[${props.index}]`} ref={register({required: true})} defaultValue={content.name} />
                {
                    errors.name ? 
                        errors.name[props.index] && <span id={`name${props.index}Error`}>This field is required</span>
                        : null
                }

                <label>School Location</label>
                <input type="text" name={`location[${props.index}]`} ref={register} defaultValue={content.location} />

                <label>Degree</label>
                <input type="text"  name={`degree[${props.index}]`} ref={register} defaultValue={content.degree} />

                <label>Major</label>
                <input type="text" name={`major[${props.index}]`} ref={register} defaultValue={content.major} />

                <label>GPA</label>
                <input type="text" name={`gpa[${props.index}]`} ref={register} defaultValue={content.gpa} />

                <label>Start Date</label>
                <input type="text" name={`start[${props.index}]`} ref={register} defaultValue={content.start} />

                <label>End Date</label>
                <input type="text" name={`end[${props.index}]`} ref={register} defaultValue={content.end} />

                <Button2 onClick={async () => {
                    props.delete()
                }}>Delete</Button2>

                <Button2 onClick={async () => {
                    const errors = await props.triggerValidation();
                    console.log(923,errors)
                    if (errors) {
                        setIsEditable(false);
                    }
                }}>Save</Button2>
            </div>
            <div className={`render ${isEditable ? 'hidden' : ''}`}>
                <div className="left">
                    <div className="name">
                        {props.watch(`name[${props.index}]`)}
                    </div>
                    <div className="course">
                        <span className="major">
                            {props.watch(`major[${props.index}]`)}
                        </span>
                        <span>
                            {
                                props.watch(`major[${props.index}]`) && 
                                props.watch(`degree[${props.index}]`) ?
                                ", " : null
                            }
                        </span>
                        <span className="degree">
                            {props.watch(`degree[${props.index}]`)}
                        </span>
                    </div>
                    {/* <div className="gpa">
                        {props.watch(`gpa[${props.index}]`)}
                    </div> */}
                </div>
                <div className="right">
                    <div className="location">
                        {props.watch(`location[${props.index}]`)}
                    </div>
                    <div className="start-end">
                        <span className="start">
                            {props.watch(`start[${props.index}]`)}
                        </span>
                        <span className="gap">
                            
                            {
                                // If there is an end date then put the dash in
                                props.watch(`end[${props.index}]`)  ? 
                                    " - " : null
                            }
                        </span>
                        <span className="end">
                            {props.watch(`end[${props.index}]`)}
                        </span>
                    </div>
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

            ${Button2} {
                margin-top: 8px;
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