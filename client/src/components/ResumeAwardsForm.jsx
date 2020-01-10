import React, { useState, useEffect } from "react";

import styled from "styled-components";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import DraggableForm from "./DraggableForm";

import ResumeAwardsFormElement from "./ResumeAwardsFormElement";

import { Button2 } from "./Button";

import { useForm } from 'react-hook-form'


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

function Awards(index, name, date, awarder, summary) {
    let result = {}
    result[`name[${index}]`] = name;
    result[`date[${index}]`] = date;
    result[`awarder[${index}]`] = awarder;
    result[`summary[${index}]`] = summary;
    return result;
}

function AwardsForm(props) {
    const [items, setItems] = useState([{
            id: "item-0",
            content: Awards(
                "0",
                "Supreme Hacker", 
                "May 2015", 
                "HackNY", 
                "Recognized for creating the most awesome project at a hackathon", 
            ),
            isFixed: false,
            isEditable: false
    }
    ]);

    
    const { register, handleSubmit, watch, errors, triggerValidation } = useForm({
        defaultValues: {
            ...Awards(
                "0",
                "Supreme Hacker", 
                "May 2015", 
                "HackNY", 
                "Recognized for creating the most awesome project at a hackathon", 
            ),
        }
    });
    const onSubmit = data => console.log(data);
    
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