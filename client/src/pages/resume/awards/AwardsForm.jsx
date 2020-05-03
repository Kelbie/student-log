import React, { useCallback, useState } from 'react';

import move from 'lodash-move';

import { Draggable } from 'react-beautiful-dnd';

import { useForm } from 'react-hook-form';
import { useDispatch, useMappedState } from 'redux-react-hook';
import _ from 'lodash';
import styled from 'styled-components';

import { saveResume } from '../../../actions/actions';

import Button from '../../../components/common/Button';
import DraggableForm from '../../../components/common/DraggableForm';
import ResumeAwardsFormElement from './AwardsFormElement';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ButtonRefactor from '../../../components/common/ButtonRefactor';
import H1 from '../../../components/common/H1';

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
          setItems([
            ...items,
            {
              id: `item-${items.length * numberOfDeletes}`,
              content: 'new item',
              isFixed: false,
              isEditable: true
            }
          ]);
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
