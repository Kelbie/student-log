import React, { useCallback, useState } from 'react';

import ResumeSkillsFormElement from './SkillsFormElement';

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
        isEditable: false,
        keywords: skill.keywords.map((keyword, j) => {
          return {
            id: `item-${j}`,
            isFixed: false,
            isEditable: false
          };
        })
      };
    })
  );

  // Form config
  const { register, handleSubmit, watch, errors, triggerValidation } = useForm({
    defaultValues: {
      skills
    }
  });

  // Dispatch on save
  const dispatch = useDispatch();
  const onSubmit = data => {
    let sortedSkills = items.map(item => {
      return {
        name: data.skills[item.id.split('-')[1]].name,
        keywords: item.keywords.map(item2 => {
          return data.skills[item.id.split('-')[1]].keywords[item2.id.split('-')[1]];
        })
      };
    });

    dispatch(saveResume({ skills: sortedSkills }));
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
        skills: skills.filter((skill, i) => {
          return i !== absoluteIndex;
        })
      })
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...props}>
      <H1>Your Skills</H1>
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
                    item={item}
                    setItems={keywords =>
                      setItems(
                        items.map(i => {
                          if (item.id == i.id) {
                            return {
                              ...i,
                              keywords
                            };
                          } else {
                            return i;
                          }
                        })
                      )
                    }
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

// Memoized to improve performance
export default React.memo(styled(SkillsForm)`
  color: ${props =>
    props.theme.is === 'dark' ? props.theme.PALLET[400] : props.theme.PALLET[700]};
`);
