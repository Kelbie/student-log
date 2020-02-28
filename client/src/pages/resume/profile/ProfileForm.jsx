import React, { useCallback, useState, useEffect } from 'react';

import { Draggable } from 'react-beautiful-dnd';

import { useForm } from 'react-hook-form';

import { useDispatch, useMappedState } from 'redux-react-hook';

import styled from 'styled-components';

import { saveResume } from '../../../actions/actions';

import { useQuery, useMutation } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import DraggableForm from '../../../components/DraggableForm';
import ResumeProfileFormElement from './ProfileFormElement';

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

function ProfileForm(props) {
  // State for item
  const [items, setItems] = useState([
    {
      id: 'item-0',
      isFixed: false,
      isEditable: true
    }
  ]);

  // Get profile resume from store
  const mapState = useCallback(
    state => ({
      profile: state.resume.profile
    }),
    []
  );

  const { profile } = useMappedState(mapState);

  // Form config
  const { register, handleSubmit, watch, errors, triggerValidation } = useForm({
    defaultValues: {
      profile
    }
  });

  // Dispatch on save
  const dispatch = useDispatch();
  const onSubmit = data => {
    dispatch(saveResume(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...props}>
      <h1>Your Personal Info</h1>
      <DraggableForm items={items} setItems={setItems}>
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
                  <ResumeProfileFormElement
                    watch={watch}
                    index={item.id.split('-')[1]}
                    register={register}
                    handle={item.isFixed === false ? provided.dragHandleProps : false}
                    content={item.content}
                    editable={item.isEditable}
                    triggerValidation={triggerValidation}
                    delete={() => {}}
                    errors={errors}
                  />
                </div>
              )}
            </Draggable>
          );
        })}
      </DraggableForm>
    </form>
  );
}

export default React.memo(styled(ProfileForm)`
  color: ${props =>
    props.theme.is === 'dark' ? props.theme.PALLET[400] : props.theme.PALLET[700]};
`);
