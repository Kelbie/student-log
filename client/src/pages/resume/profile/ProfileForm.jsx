import React, { useCallback, useState, useEffect } from 'react';

import { Draggable } from 'react-beautiful-dnd';

// Forms
import { useForm } from 'react-hook-form';

// Redux
import { useDispatch, useMappedState } from 'redux-react-hook';
import { saveResume } from '../../../actions/actions';

// Styling
import styled from 'styled-components';

// Common
import DraggableForm from '../../../components/common/DraggableForm';
import H1 from '../../../components/common/H1';

// Components
import ResumeProfileFormElement from './ProfileFormElement';

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
      <H1>Your Personal Info</H1>
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

// Memoized to improve performance
export default React.memo(styled(ProfileForm)`
  color: ${props =>
    props.theme.is === 'dark' ? props.theme.PALLET[400] : props.theme.PALLET[700]};
`);
