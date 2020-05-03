import React, { useEffect, useState, useCallback } from 'react';

import {Link, Route, withRouter, useRouteMatch, Switch} from "react-router-dom";

import { Draggable } from 'react-beautiful-dnd';

import Modal from 'styled-react-modal';

// Helper
import _ from 'lodash';
import move from 'lodash-move';
import omitDeep from 'omit-deep-lodash';

// Icons
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

// Redux
import { useDispatch, useMappedState } from 'redux-react-hook';
import { saveResume } from '../../actions/actions';

// Styling
import styled from 'styled-components';

// GraphQL
import { useMutation, useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';

// Pages
import ResumeAwardsForm from './awards/AwardsForm';
import ResumeEducationFrom from './education/EducationForm';
import ResumeProfileForm from './profile/ProfileForm';
import ResumeProjectsForm from './projects/ProjectsForm';
import ResumeWorkFrom from './work/WorkForm';
import ResumeTemplatesForm from './template/TemplatePage';
import ResumeSkillsForm from './skills/SkillsForm';
import ResumePDF from "./pdf_view/PDFView";

// Components
import DraggableForm from '../../components/common/DraggableForm';
import ButtonRefactor from '../../components/common/ButtonRefactor';

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

function ResumeNavElement({ handle, ...props }) {
  let active = '/resume/' + props.title.toLowerCase() === props.location.pathname;

  return (
    <div {...props}>
      <div {...handle} className={`handle`}>
        ::
      </div>
      <Link
        to={`/resume/${props.title.toLowerCase()}`}
        className={`title ${active ? 'active' : ''}`}
      >
        {props.title}
        <div className={`underline`}></div>
      </Link>
    </div>
  );
}

ResumeNavElement = styled(withRouter(ResumeNavElement))`
  display: flex;

  .handle {
    color: ${props => props.theme.PRIMARY_COLOR};
    visibility: ${props => (props.handle ? 'visible' : 'hidden')};
    margin-right: 8px;
    font-family: 'Times New Roman';
  }

  .title {
    transition: 0.1s ease 0s;
    text-decoration: none;
    position: relative;
    color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET[400] : props.theme.PALLET[600]};

    &.active {
      color: ${props => props.theme.PRIMARY_COLOR};
    }

    &:hover > .underline {
      width: 100%;
    }

    .underline {
      transition: 0.3s ease 0s;
      width: 0%;
      height: 1.25px;
      position: absolute;
      bottom: 0;
      background: ${props => props.theme.PRIMARY_COLOR};
    }
  }
`;

function ResumeNav(props) {
  // Get projects resume from store
  const mapState = useCallback(
    state => ({
      sections: state.resume.sections
    }),
    []
  );

  const { sections } = useMappedState(mapState);
  const dispatch = useDispatch();

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  const [items, setItems] = useState([
    {
      id: 'item-3',
      content: capitalizeFirstLetter(sections[2]),
      isFixed: false
    },
    {
      id: 'item-2',
      content: capitalizeFirstLetter(sections[3]),
      isFixed: false
    },
    {
      id: 'item-5',
      content: capitalizeFirstLetter(sections[4]),
      isFixed: false
    },
    {
      id: 'item-4',
      content: capitalizeFirstLetter(sections[5]),
      isFixed: false
    },
    {
      id: 'item-6',
      content: capitalizeFirstLetter(sections[6]),
      isFixed: false
    }
  ]);

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  return (
    <div {...props}>
      <ResumeNavElement handle={false} title={'Templates'} />
      <ResumeNavElement handle={false} title={'Profile'} />
      <DraggableForm
        items={items}
        setItems={setItems}
        onDragEnd={(start, end) => {
          setItems(move(items, start, end));
          dispatch(saveResume({ sections: move(sections, start + 2, end + 2) }));
        }}
      >
        {items.map((item, index) => (
          <Draggable
            isDragDisabled={item.isFixed}
            key={item.id}
            draggableId={item.id}
            index={index}
            direction={'vertical'}
          >
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
              >
                <ResumeNavElement
                  handle={item.isFixed == false ? provided.dragHandleProps : false}
                  title={item.content}
                />
              </div>
            )}
          </Draggable>
        ))}
      </DraggableForm>
      <ButtonRefactor icon={faFilePdf} variant={'border'} onClick={() => props.showPDF(true)}>
        Generate PDF
      </ButtonRefactor>
    </div>
  );
}

ResumeNav = styled(ResumeNav)`
  display: inline-block;
  margin-right: 8px;
  position: -webkit-sticky;
  position: sticky;
  top: 16px;
  height: 1vh;

  ${ButtonRefactor} {
    margin-top: 4px;
  }
`;

// TODO: ADD Resume Nav Bar
// function ResumePDFNav(props) {
//   return (
//     <div {...props}>
//       <div>
//         <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
//         Page 1<FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>
//       </div>
//     </div>
//   );
// }

const GET_RESUME = gql`
  query {
    getResume {
      sections
      template
      profile {
        name
        email
        number
        location
        link
      }
      work {
        name
        title
        location
        start
        end
      }
      education {
        name
        location
        degree
        major
        gpa
        start
        end
      }
      skills {
        name
        keywords
      }
      projects {
        name
        description
        link
      }
      awards {
        name
        date
        awarder
        summary
      }
    }
  }
`;

const UPDATE_RESUME = gql`
  mutation updateResume($resume: ResumeInput!) {
    updateResume(resume: $resume) {
      profile {
        name
      }
    }
  }
`;

function ResumePage(props) {
  const { data, error, loading } = useQuery(GET_RESUME);
  const [updateResume] = useMutation(UPDATE_RESUME);
  const [showPDF, setShowPDF] = useState(false);
  let { path, url } = useRouteMatch();
  const dispatch = useDispatch();

  const mapState = useCallback(
    state => ({
      resume: state.resume
    }),
    []
  );

  const { resume } = useMappedState(mapState);

  useEffect(() => {
    updateResume({
      variables: {
        resume: omitDeep(resume, '__typename')
      }
    });
  }, [resume]);

  useEffect(() => {
    if (data) {
      if (data.getResume) {
        if (data.getResume.sections) {
          if (data.getResume.sections[0]) {
            dispatch(saveResume(data.getResume));
          }
        }
      }
    }
  }, [data]);
  return (
    <div {...props}>
      <Modal
        isOpen={showPDF}
        onEscapeKeydown={() => setShowPDF(false)}
        onBackgroundClick={() => setShowPDF(false)}
      >
        <ResumePDF />
      </Modal>
      <ResumeNav showPDF={b => setShowPDF(b)} />
      <Switch>
        <Route path={`${path}/templates`}>
          <ResumeTemplatesForm />
        </Route>
        <Route path={`${path}/profile`}>
          <ResumeProfileForm />
        </Route>
        <Route path={`${path}/work`}>
          <ResumeWorkFrom />
        </Route>
        <Route path={`${path}/education`}>
          <ResumeEducationFrom />
        </Route>
        <Route path={`${path}/skills`}>
          <ResumeSkillsForm />
        </Route>
        <Route path={`${path}/Projects`}>
          <ResumeProjectsForm />
        </Route>
        <Route path={`${path}/awards`}>
          <ResumeAwardsForm />
        </Route>
      </Switch>
    </div>
  );
}

export default styled(withRouter(ResumePage))`
  display: flex;

  > *:last-child {
    flex-grow: 1;
  }
`;
