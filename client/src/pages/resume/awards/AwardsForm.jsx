import React, { useCallback, useState } from 'react';

import { Draggable } from 'react-beautiful-dnd';

// Common
import DraggableForm from '../../../components/common/DraggableForm';
import ButtonRefactor from '../../../components/common/ButtonRefactor';
import H1 from '../../../components/common/H1';

// Helper
import move from 'lodash-move';
import _ from 'lodash';

// Forms
import { useForm } from 'react-hook-form';

// Redux
import { useDispatch, useMappedState } from 'redux-react-hook';
import { saveResume } from '../../../actions/actions';

// Stylign
import styled from 'styled-components';

// Components
import ResumeAwardsFormElement from './AwardsFormElement';

// Icons
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const grid = 8;

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

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250
});

function createArrayWithNumbers(length) {
  return Array.from({ length }, (_, k) => k + 1);
}

function AwardsForm(props) {
  const [numberOfDeletes, setNumberOfDeletes] = useState(1);
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
  const { register, handleSubmit, watch, errors, triggerValidation, reset } = useForm({
    defaultValues: {
      awards
    }
  });

  // Dispatch on save
  const dispatch = useDispatch();
  const onSubmit = data => {
    let sortedAwards = items.map(item => {
      return data.awards[item.id.split('-')[1]];
    });

    dispatch(saveResume({ ...data, awards: sortedAwards }));
  };

  // delete draggable item and redux item
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
        awards: awards.filter((award, i) => {
          return i !== absoluteIndex;
        })
      })
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...props}>
      <H1>Honors & Awards</H1>
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
      <ButtonRefactor
        variant="border"
        icon={faPlus}
        onClick={() => {
          // if clicked add a new draggable item
          setItems([
            ...items,
            {
              id: `item-${items.length * numberOfDeletes}`,
              content: 'new item',
              isFixed: false,
              isEditable: true
            }
          ]);
          // if clicked add a new empty item
          dispatch(
            saveResume({
              awards: [...awards, { name: '', date: '', awarder: '', summary: '' }]
            })
          );
        }}
      >
        Add Award
      </ButtonRefactor>
    </form>
  );
}

// Memoized to improve performance
export default React.memo(styled(AwardsForm)`
  color: ${props =>
    props.theme.is === 'dark' ? props.theme.PALLET[400] : props.theme.PALLET[700]};
`);
