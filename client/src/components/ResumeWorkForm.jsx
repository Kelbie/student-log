import React, { useCallback, useState } from 'react';

import move from 'lodash-move';

import { Draggable } from 'react-beautiful-dnd';

import { useForm } from 'react-hook-form';

import { useDispatch, useMappedState } from 'redux-react-hook';

import styled from 'styled-components';

import { saveResume } from '../actions/actions';

import Button, { Button2 } from './common/Button';
import DraggableForm from './DraggableForm';
import ResumeWorkFormElement from './ResumeWorkFormElement';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ButtonRefactor from './common/ButtonRefactor';

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

function Work(index, name, title, location, start, end) {
  let result = {};
  result[`name[${index}]`] = name;
  result[`title[${index}]`] = title;
  result[`location[${index}]`] = location;
  result[`start[${index}]`] = start;
  result[`end[${index}]`] = end;
  return result;
}

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
  const { register, handleSubmit, watch, errors, triggerValidation, reset } = useForm({
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
      <h1>Your Work Experience</h1>
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

export default React.memo(styled(WorkForm)`
  color: ${props =>
    props.theme.is === 'dark' ? props.theme.PALLET[400] : props.theme.PALLET[700]};
`);
