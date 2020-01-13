import React, { useState, useEffect } from "react";

import styled from "styled-components";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import DraggableForm from "./DraggableForm";

import ResumeAwardsFormElement from "./ResumeAwardsFormElement";

import { Button2 } from "./Button";

import { useForm } from 'react-hook-form'

import { useStateMachine } from "little-state-machine";
import updateAction from "../updateAction";


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

function createArrayWithNumbers(length) {
    return Array.from({ length }, (_, k) => k + 1);
}

function AwardsForm(props) {
    const { action, state } = useStateMachine(updateAction);
    const [items, setItems] = useState(state.awards.map((award, i) => {
        return {
            id: `item-${i}`,
            content: award,
            isFixed: false,
            isEditable: false
        }
    }));


    
    const { register, handleSubmit, watch, errors, triggerValidation } = useForm({
        defaultValues: {
            awards: state.awards
        }
    });
    const onSubmit = data => {action(data)};
    
    const watchAllFields = watch();
    
    function del(id) {
        setItems([...items.filter(item_ => {
            if (item_.id != id) {
                return true
            }
        })]);
    }

    return <form onSubmit={handleSubmit(onSubmit)} {...props}>
        <h1>Honors & Awards</h1>
        <DraggableForm items={items} setItems={setItems}>
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
                                    {/* Use item id as index because it doesn't change when being swapped around in the UI */}
                                    <ResumeAwardsFormElement 
                                        watch={watch} 
                                        index={item.id.split("-")[1]} 
                                        register={register} 
                                        handle={item.isFixed === false ? 
                                            provided.dragHandleProps : false} 
                                        content={item.content} 
                                        editable={item.isEditable} 
                                        triggerValidation={triggerValidation}
                                        delete={() => {
                                            del(item.id)
                                        }}
                                        errors={errors}
                                    />
                            </div>
                        )}
                    </Draggable>
                })
            }
        </DraggableForm>
        <Button2 onClick={() => {
            setItems([...items, {
                id: `item-${items.length}`,
                content: 'new item',
                isFixed: false,
                isEditable: true
            }])
        }}>Add Award</Button2>
    </form>
}

export default styled(AwardsForm)`
    color: ${props => props.theme.is === "dark" ? "white" : "black"};
`;