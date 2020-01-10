import React, { useState, useEffect } from "react";

import styled from "styled-components";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { BrowserRouter as Router, Route, Link, Switch, useRouteMatch, withRouter } from "react-router-dom";
import Button, { Button2 } from "./Button";

import ResumeEducationFrom from "./ResumeEducationForm";
import ResumeWorkFrom from "./ResumeWorkForm";
import ResumeAwardsForm from "./ResumeAwardsForm";
import ResumeProfileForm from "./ResumeProfileForm";
import ResumeProjectsForm from "./ResumeProjectsForm";

// fake data generator
const getItems = count =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k}`,
        content: `item ${k}`
    }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const grid = 8;


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

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,
    width: 250
});

function ResumeNavElement({handle, ...props}) {
    console.log(222, props);

    let active = "/resume/"+props.title.toLowerCase() === props.location.pathname;

    return <div {...props}>
        <div {...handle} className={`handle`}>
            <FontAwesomeIcon icon={faGripVertical}  />
        </div>
        <Link to={`/resume/${props.title.toLowerCase()}`} className={`title ${ active ? "active" : "" }`}>
            {props.title}
            <div className={`underline`}></div>
        </Link>
    </div>
}

ResumeNavElement = styled(withRouter(ResumeNavElement))`
    display: flex;

    .handle {
        color: ${props => props.theme.PRIMARY_COLOR};
        visibility: ${props => props.handle ? 'visible' : 'hidden' };
        margin-right: 8px;
    }

    
    .title {
        transition: 0.1s ease 0s;
        text-decoration: none;
        position: relative;
        color: ${props => props.theme.is === "dark" ? "white" : "black"};
        
        &.active {
            color: ${props => props.theme.PRIMARY_COLOR};
        }

        &:hover > .underline {
            width: 100%;
        } 
        
        .underline {
            transition: .3s ease 0s;
            width: 0%;
            height: 1.25px;
            position: absolute;
            bottom: 0;
            background: ${props => props.theme.PRIMARY_COLOR};
        }

    }
`;



class ResumeNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [
            {
                id: "item-2",
                content: "Work",
                isFixed: false
            },
            {
                id: "item-3",
                content: "Education",
                isFixed: false
            },
            {
                id: "item-4",
                content: "Skills",
                isFixed: false
            },
            {
                id: "item-5",
                content: "Projects",
                isFixed: false
            },
            {
                id: "item-6",
                content: "Awards", 
                isFixed: false
            }]
        };
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items = reorder(
            this.state.items,
            result.source.index,
            result.destination.index
        );

        this.setState({
            items
        });
    }

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {
        return (
            <div {...this.props}>
                <ResumeNavElement handle={false} title={"Template"} />
                <ResumeNavElement handle={false} title={"Profile"} />
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {this.state.items.map((item, index) => (
                                    <Draggable isDragDisabled={item.isFixed} key={item.id} draggableId={item.id} index={index} direction={'vertical'}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style
                                                )}
                                                >
                                                <ResumeNavElement handle={item.isFixed == false ? provided.dragHandleProps : false} title={item.content} />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        );
    }
}

ResumeNav = styled(ResumeNav)`
    margin-right: 8px;
`;

function ResumePage(props) {
    let { path, url } = useRouteMatch();

    return <div {...props}>
        <ResumeNav />
        <Switch>
            <Route path={`${path}/templates`}>
                {/* <TemplatesForm /> */}
            </Route>
            <Route path={`${path}/profile`}>
                <ResumeProfileForm />
            </Route>
            <Route path={`${path}/work`}>
                <ResumeWorkFrom />
            </Route>
            <Route path={`${path}/education`}>
                <ResumeEducationFrom />
            </Route>
            <Route path={`${path}/skills`}>
                {/* <SkillsForm /> */}
            </Route>
            <Route path={`${path}/Projects`}>
                <ResumeProjectsForm />
            </Route>
            <Route path={`${path}/awards`}>
                <ResumeAwardsForm />
            </Route>
        </Switch>
    </div>
}

export default styled(withRouter(ResumePage))`
    display: flex;

    > *:last-child {
        flex-grow: 1;
    }
`;