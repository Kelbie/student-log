import React, { useCallback, useState } from 'react';

// Helper
import move from 'lodash-move';

// Forms
import { useForm } from 'react-hook-form';
import { Draggable } from 'react-beautiful-dnd';

// redux
import { useDispatch, useMappedState } from 'redux-react-hook';
import { saveResume } from '../../../actions/actions';

// Styling
import styled from 'styled-components';

// Common
import H1 from '../../../components/common/H1';
import ButtonRefactor from '../../../components/common/ButtonRefactor';
import DraggableForm from '../../../components/common/DraggableForm';

// Icons
import { faPlus } from '@fortawesome/free-solid-svg-icons';

// Components
import ResumeProjectsFormElement from './ProjectsFormElement';

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

function ProjectsForm(props) {
  const [numberOfDeletes, setNumberOfDeletes] = useState(1);

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
  const { register, handleSubmit, watch, errors, triggerValidation, reset } = useForm({
    defaultValues: {
      projects: projects
    }
  });

  // Dispatch on save
  const dispatch = useDispatch();
  const onSubmit = data => {
    let sortedProjects = items.map(item => {
      return data.projects[item.id.split('-')[1]];
    });

    dispatch(saveResume({ ...data, projects: sortedProjects }));
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
        projects: projects.filter((project, i) => {
          return i !== absoluteIndex;
        })
      })
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...props}>
      <H1>Your Projects</H1>
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
      <ButtonRefactor
        icon={faPlus}
        variant={'border'}
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
              projects: [...projects, { name: '', description: '', link: '' }]
            })
          );
        }}
      >
        Add Project
      </ButtonRefactor>
    </form>
  );
}

// Memoized to improve performance
export default React.memo(styled(ProjectsForm)`
  color: ${props =>
    props.theme.is === 'dark' ? props.theme.PALLET[400] : props.theme.PALLET[700]};
`);
