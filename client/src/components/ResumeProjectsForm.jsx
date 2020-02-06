import React, { useCallback, useState } from 'react';

import move from 'lodash-move';

import { Draggable } from 'react-beautiful-dnd';

import { useForm } from 'react-hook-form';

import { useDispatch, useMappedState } from 'redux-react-hook';

import styled from 'styled-components';

import { saveResume } from '../actions/actions';

import Button, { Button2 } from './Button';
import DraggableForm from './DraggableForm';
import ResumeProjectsFormElement from './ResumeProjectsFormElement';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

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

function ProjectsForm(props) {
  // Get projects resume from store
  const mapState = useCallback(
    state => ({
      projects: state.resume.projects
    }),
    []
  );

  const { projects } = useMappedState(mapState);

  // State for each item
  const [items, setItems] = useState(
    projects.map((project, i) => {
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
      projects: projects
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
        projects: projects.filter((project, i) => {
          return i != id.split('-')[1];
        })
      })
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...props}>
      <h1>Your Projects</h1>
      <DraggableForm
        items={items}
        setItems={setItems}
        onDragEnd={(start, end) => {
          setItems(move(items, start, end));
          dispatch(saveResume({ projects: move(projects, start, end) }));
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
                  <ResumeProjectsFormElement
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
      <Button
        icon={faPlus}
        variant={'fill'}
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
        Add Project
      </Button>
    </form>
  );
}

export default styled(ProjectsForm)`
  color: ${props =>
    props.theme.is === 'dark' ? props.theme.PALLET[400] : props.theme.PALLET[700]};
`;
