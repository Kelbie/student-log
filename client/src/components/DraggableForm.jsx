import React, { useState, useEffect } from "react";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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

class DraggableForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: this.props.items
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

        this.props.setItems(items);
    }

    // For when items are added dynamically
    componentWillReceiveProps(nextProps){
        if(nextProps.items!==this.props.items){
            //Perform some operation
            this.setState({items: nextProps.items});
        }
    }

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {
        return (
            <>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {this.props.children}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </>
        );
    }
}

export default DraggableForm;