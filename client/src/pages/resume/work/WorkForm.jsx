import React, { useCallback, useState } from 'react';

import { Draggable } from 'react-beautiful-dnd';

// Helper
import move from 'lodash-move';

// Forms
import { useForm } from 'react-hook-form';

// Styling
import styled from 'styled-components';

// Redux
import { useDispatch, useMappedState } from 'redux-react-hook';
import { saveResume } from '../../../actions/actions';

// Common
import H1 from '../../../components/common/H1';
import DraggableForm from '../../../components/common/DraggableForm';
import ButtonRefactor from '../../../components/common/ButtonRefactor';

// Icons
import { faPlus } from '@fortawesome/free-solid-svg-icons';

// Components
import ResumeWorkFormElement from './WorkFormElement';

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

function WorkForm(props) {
  const [numberOfDeletes, setNumberOfDeletes] = useState(1);

  // Get work resume from store
  const mapState = useCallback(
    state => ({
      work: state.resume.work
    }),
    []
  );

  const { work } = useMappedState(mapState);

  const [items, setItems] = useState(
    work.map((work, i) => {
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
      work
    }
  });

  // Dispatch on save
  const dispatch = useDispatch();
  const onSubmit = data => {
    let sortedWork = items.map(item => {
      return data.work[item.id.split('-')[1]];
    });

    dispatch(saveResume({ ...data, work: sortedWork }));
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

    dispatch(
      saveResume({
        work: work.filter((work, i) => {
          return i !== absoluteIndex;
        })
      })
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...props}>
      <H1>Your Work Experience</H1>
      <DraggableForm
        items={items}
        setItems={setItems}
        onDragEnd={(start, end) => {
          setItems(move(items, start, end));
          dispatch(saveResume({ work: move(work, start, end) }));
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
                  <ResumeWorkFormElement
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
          setItems([
            ...items,
            {
              id: `item-${items.length * numberOfDeletes}`,
              isFixed: false,
              isEditable: true
            }
          ]);
          dispatch(
            saveResume({
              work: [...work, { name: '', title: '', location: '', start: '', end: '' }]
            })
          );
        }}
      >
        Add Job
      </ButtonRefactor>
    </form>
  );
}

// Memoized to improve performance
export default React.memo(styled(WorkForm)`
  color: ${props =>
    props.theme.is === 'dark' ? props.theme.PALLET[400] : props.theme.PALLET[700]};
`);
