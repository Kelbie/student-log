import React, { useEffect, useState, useCallback } from 'react';

import { faFilePdf, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import move from 'lodash-move';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { saveResume } from '../actions/actions';

import _ from 'lodash';

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

import { Link, Route, Switch, useRouteMatch, withRouter } from 'react-router-dom';

import styled from 'styled-components';
import { useMutation } from 'react-apollo-hooks';
import gql from 'graphql-tag';

import Button from './common/Button';
import ResumeAwardsForm from './ResumeAwardsForm';
import ResumeEducationFrom from './ResumeEducationForm';
import ResumeProfileForm from './ResumeProfileForm';
import ResumeProjectsForm from './ResumeProjectsForm';
import ResumeWorkFrom from './ResumeWorkForm';
import ResumeTemplatesForm from './ResumeTemplatesForm';
import ResumeSkillsForm from './ResumeSkillsForm';
import DraggableForm from './DraggableForm';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

function ResumePDF(props) {
  // Get resume from store
  const mapState = useCallback(
    state => ({
      resume: state.resume
    }),
    []
  );

  const { resume } = useMappedState(mapState);

  const [pages, setPages] = useState(null);
  const [page, setPage] = useState(1);
  const [url, setUrl] = useState('');

  useEffect(() => {
    async function hydrate() {
      let data = resume;

      // Profile Map
      data = _.mapKeys(data, function(value, key) {
        switch (key) {
          case 'profile':
            return 'basics';
          case 'template':
            return 'selectedTemplate';
          default:
            return key;
        }
      });

      // Awards Map
      data.awards = data.awards.map(award => {
        return _.mapKeys(award, function(value, key) {
          switch (key) {
            case 'name':
              return 'title';
            default:
              return key;
          }
        });
      });

      // Education Map
      data.education = data.education.map(education => {
        return _.mapKeys(education, function(value, key) {
          switch (key) {
            case 'name':
              return 'institution';
            case 'degree':
              return 'studyType';
            case 'major':
              return 'area';
            case 'start':
              return 'startDate';
            case 'end':
              return 'endDate';
            default:
              return key;
          }
        });
      });

      // Projects Map
      data.projects = data.projects.map(project => {
        return _.mapKeys(project, function(value, key) {
          switch (key) {
            case 'link':
              return 'url';
            default:
              return key;
          }
        });
      });

      // Work Map
      data.work = data.work.map(work => {
        return _.mapKeys(work, function(value, key) {
          switch (key) {
            case 'name':
              return 'company';
            case 'end':
              return 'endDate';
            case 'start':
              return 'startDate';
            case 'title':
              return 'position';
            default:
              return key;
          }
        });
      });

      // Profile Map
      data.basics = _.mapKeys(data.basics, function(value, key) {
        switch (key) {
          case 'number':
            return 'phone';
          case 'link':
            return 'website';
          default:
            return key;
        }
      });

      data.basics.location = {
        address: data.basics.location
      };

      data.sections = data.sections.map(section => {
        return section.toLowerCase();
      });

      const request = {
        method: 'POST',
        headers: {
          Accept: 'application/pdf',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };

      const response = await fetch('/api/generate/resume', request);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setUrl(url);
    }

    hydrate();
  }, []);

  return (
    <div {...props}>
      <ResumePDFNav></ResumePDFNav>
      <Document file={url} onLoadSuccess={e => setPages(e.numPages)}>
        <Page pageNumber={page} renderAnnotations={false} renderTextLayer={false} />
      </Document>
    </div>
  );
}

ResumePDF = styled(ResumePDF)`
  width: 100%;
  height: 100%;
  overflow: auto;

  .react-pdf__Document,
  .react-pdf__Page {
    height: 100%;
  }

  canvas {
    height: 100% !important;
    width: auto !important;
    max-width: 100%;
    margin: auto;
  }

  canvas + div {
    height: auto;
    width: auto;
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

  console.log(sections, 109283);

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
      <Button icon={faFilePdf} variant={'fill'} onClick={() => props.showPDF(true)}>
        Generate PDF
      </Button>
    </div>
  );
}

ResumeNav = styled(ResumeNav)`
  margin-right: 8px;
`;

function ResumePDFNav(props) {
  return (
    <div {...props}>
      <div>
        <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
        Page 1<FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>
      </div>
    </div>
  );
}

const POST_RESUME = gql`
  mutation updateResume($resume: ResumeInput) {
    updateResume(resume: $resume) {
      profile {
        name
      }
    }
  }
`;

const customStyles = {};

function ResumePage(props) {
  const [updateResume] = useMutation(POST_RESUME);
  const [showPDF, setShowPDF] = useState(false);
  let { path, url } = useRouteMatch();

  // Get profile resume from store
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
        resume: {
          ...resume
        }
      }
    });
  }, [resume]);

  const [modelIsOpen, setModelIsOpen] = useState(false);

  return (
    <div {...props}>
      <ResumeNav showPDF={b => setShowPDF(b)} />
      <Modal contentLabel="Example Modal" isOpen={showPDF} onRequestClose={() => setShowPDF(false)}>
        <ResumePDF />
      </Modal>
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
  .ReactModal__Content,
  .ReactModal__Content--after-open {
    padding: 0px !important;
  }

  display: flex;

  > *:last-child {
    flex-grow: 1;
  }
`;
