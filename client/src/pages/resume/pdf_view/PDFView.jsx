import React, { useEffect, useState, useCallback } from 'react';

import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

// Helper
import _ from 'lodash';

// Styling
import styled from 'styled-components';

// Redux
import { useMappedState } from 'redux-react-hook';

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
    // we need to hydrade the data into a new format because resumake doesn't accept the same format as we have used on the front-end.
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
      {/* <ResumePDFNav></ResumePDFNav> */}
      <Document file={url} onLoadSuccess={e => setPages(e.numPages)}>
        <Page pageNumber={page} renderAnnotations={false} renderTextLayer={false} />
      </Document>
    </div>
  );
}

ResumePDF = styled(ResumePDF)`
  height: 100%;

  .react-pdf__Document,
  .react-pdf__Page {
    height: 100%;
  }

  canvas {
    width: auto !important;
    max-width: 100%;
    margin: auto;
    height: auto !important;
    max-height: 100%;
  }

  canvas + div {
    height: auto;
    width: auto;
  }
`;

export default ResumePDF;