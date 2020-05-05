import React, { useCallback, useState } from 'react';

import { Draggable } from 'react-beautiful-dnd';

// Helper
import move from 'lodash-move';

// Forms
import { useForm } from 'react-hook-form';

// Redux
import { useDispatch, useMappedState } from 'redux-react-hook';
import { saveResume } from '../../../actions/actions';

// Styling
import styled from 'styled-components';

// Icons
import { faPlus } from '@fortawesome/free-solid-svg-icons';

// Common
import DraggableForm from '../../../components/common/DraggableForm';
import ButtonRefactor from '../../../components/common/ButtonRefactor';
import H1 from '../../../components/common/H1';

// Components
import ResumeEducationFormElement from './EducationFormElement';

// Get the current style which is used to style the animation of the dragging.
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

function EducationForm(props) {
  const [numberOfDeletes, setNumberOfDeletes] = useState(1);
  // Get education resume from store
  const mapState = useCallback(
    state => ({
      education: state.resume.education
    }),
    []
  );

  const { education } = useMappedState(mapState);

  // State for each item
  const [items, setItems] = useState(
    education.map((education, i) => {
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
      education
    }
  });

  // Dispatch on save
  const dispatch = useDispatch();
  const onSubmit = data => {
    let sortedEducation = items.map(item => {
      return data.education[item.id.split('-')[1]];
    });

    dispatch(saveResume({ ...data, education: sortedEducation }));
  };

  // delete the item from the drag list and redux
  function del(id) {
    setNumberOfDeletes(numberOfDeletes + 1);
    let index = -1;
    setItems([
      ...items.filter(item_ => {
        if (item_.id !== id) {
          return true;
        } else {
          index = id;
        }
      })
    ]);

    let absoluteIndex = -1;
    items.map((item, i) => {
      if (item.id === index) {
        absoluteIndex = i;
      }
    });
    
    // ensure redux deletes the item
    dispatch(
      saveResume({
        education: education.filter((e, i) => {
          return i !== absoluteIndex;
        })
      })
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...props}>
      <H1>Your Educational Background</H1>
      <DraggableForm
        items={items}
        setItems={setItems}
        onDragEnd={(start, end) => {
          setItems(move(items, start, end));
          dispatch(saveResume({ education: move(education, start, end) }));
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
                  <ResumeEducationFormElement
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
      <ButtonRefactor
        icon={faPlus}
        variant={'border'}
        onClick={() => {
          // create new draggable item
          setItems([
            ...items,
            {
              id: `item-${items.length * numberOfDeletes}`,
              content: 'new item',
              isFixed: false,
              isEditable: true
            }
          ]);
          // create new item with no data in redux
          dispatch(
            saveResume({
              education: [
                ...education,
                { name: '', location: '', degree: '', major: '', gpa: '', start: '', end: '' }
              ]
            })
          );
        }}
      >
        Add School
      </ButtonRefactor>
    </form>
  );
}

// Memoized to improve performance
export default React.memo(styled(EducationForm)`
  color: ${props =>
    props.theme.is === 'dark' ? props.theme.PALLET[400] : props.theme.PALLET[700]};
`);
