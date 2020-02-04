import React, { useCallback, useState } from 'react';

import move from 'lodash-move';

import { Draggable } from 'react-beautiful-dnd';

import { useForm } from 'react-hook-form';
import { useDispatch, useMappedState } from 'redux-react-hook';

import styled from 'styled-components';

import { saveResume } from '../actions/actions';

import { Button2 } from './Button';
import DraggableForm from './DraggableForm';
import ResumeAwardsFormElement from './ResumeAwardsFormElement';

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
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250
});

function createArrayWithNumbers(length) {
  return Array.from({ length }, (_, k) => k + 1);
}

function AwardsForm(props) {
  // Get awards resume from store
  const mapState = useCallback(
    state => ({
      awards: state.resume.awards
    }),
    []
  );

  const { awards } = useMappedState(mapState);

  // State for each item
  const [items, setItems] = useState(
    awards.map((award, i) => {
      return {
        id: `item-${i}`,
        isFixed: false,
        isEditable: false
      };
    })
  );

  // Form config
  const { register, handleSubmit, watch, errors, triggerValidation } = useForm({
    defaultValues: {
      awards
    }
  });

  // Dispatch on save
  const dispatch = useDispatch();
  const onSubmit = data => {
    dispatch(saveResume(data));
  };

  function del(id) {
    setItems([
      ...items.filter(item_ => {
        if (item_.id != id) {
          return true;
        }
      })
    ]);
    dispatch(
      saveResume({
        awards: awards.filter((award, i) => {
          return i != id.split('-')[1];
        })
      })
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...props}>
      <h1>Honors & Awards</h1>
      <DraggableForm
        items={items}
        setItems={setItems}
        onDragEnd={(start, end) => {
          setItems(move(items, start, end));
          dispatch(saveResume({ awards: move(awards, start, end) }));
        }}
      >
        {items.map((item, index) => {
          return (
            <Draggable key={item.id} draggableId={item.id} index={index} direction={'vertical'}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                >
                  {/* Use item id as index because it doesn't change when being swapped around in the UI */}
                  <ResumeAwardsFormElement
                    watch={watch}
                    index={item.id.split('-')[1]}
                    register={register}
                    handle={item.isFixed === false ? provided.dragHandleProps : false}
                    editable={item.isEditable}
                    triggerValidation={triggerValidation}
                    delete={() => {
                      del(item.id);
                    }}
                    errors={errors}
                  />
                </div>
              )}
            </Draggable>
          );
        })}
      </DraggableForm>
      <Button2
        onClick={() => {
          setItems([
            ...items,
            {
              id: `item-${items.length}`,
              content: 'new item',
              isFixed: false,
              isEditable: true
            }
          ]);
        }}
      >
        Add Award
      </Button2>
    </form>
  );
}

export default styled(AwardsForm)`
  color: ${props => (props.theme.is === 'dark' ? 'white' : 'black')};
`;
