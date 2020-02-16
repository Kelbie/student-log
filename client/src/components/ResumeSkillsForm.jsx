import React, { useCallback, useState } from 'react';

import move from 'lodash-move';

import { Draggable } from 'react-beautiful-dnd';

import { useForm } from 'react-hook-form';

import { useDispatch, useMappedState } from 'redux-react-hook';

import styled from 'styled-components';

import { saveResume } from '../actions/actions';

import Button, { Button2 } from './common/Button';
import DraggableForm from './DraggableForm';
import ResumeSkillsFormElement from './ResumeSkillsFormElement';
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

function Skill(index, name, title, location, start, end) {
  let result = {};
  result[`name[${index}]`] = name;
  result[`title[${index}]`] = title;
  result[`location[${index}]`] = location;
  result[`start[${index}]`] = start;
  result[`end[${index}]`] = end;
  return result;
}

function SkillsForm(props) {
  const [numberOfDeletes, setNumberOfDeletes] = useState(1);

  // Get skills resume from store
  const mapState = useCallback(
    state => ({
      skills: state.resume.skills
    }),
    []
  );

  const { skills } = useMappedState(mapState);

  const [items, setItems] = useState(
    skills.map((skill, i) => {
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
      skills
    }
  });

  // Dispatch on save
  const dispatch = useDispatch();
  const onSubmit = data => {
    console.log(data, 98172873);
    let sortedSkills = items.map(item => {
      return data.skills[item.id.split('-')[1]];
    });

    // filter undefined
    sortedSkills = sortedSkills.map(skill => {
      return {
        ...skill,
        keywords: skill.keywords.filter(keyword => {
          return keyword != undefined || keyword != null;
        })
      };
    });

    console.log(sortedSkills, 98172873);

    dispatch(saveResume({ ...data, skills: sortedSkills }));
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
        skills: skills.filter((skill, i) => {
          return i !== absoluteIndex;
        })
      })
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...props}>
      <h1>Your Skills</h1>
      <DraggableForm
        items={items}
        setItems={setItems}
        onDragEnd={(start, end) => {
          setItems(move(items, start, end));
          dispatch(saveResume({ skills: move(skills, start, end) }));
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
                  <ResumeSkillsFormElement
                    skills={skills}
                    watch={watch}
                    index={item.id.split('-')[1]}
                    parentIndex={index}
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
        variant={'border'}
        type={'button'}
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
              skills: [...skills, { name: '', keywords: [''] }]
            })
          );
        }}
      >
        Add Skill
      </ButtonRefactor>
    </form>
  );
}

export default React.memo(styled(SkillsForm)`
  color: ${props =>
    props.theme.is === 'dark' ? props.theme.PALLET[400] : props.theme.PALLET[700]};
`);
