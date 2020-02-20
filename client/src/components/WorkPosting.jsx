import React from 'react';

import styled from 'styled-components';

import Markdown from 'react-markdown';
import WorkElement from './WorkElement';

import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';

import moment from 'moment';

const GET_JOB = gql`
  query getJob($id: String) {
    getJob(id: $id) {
      id
      job_title
      category
      job_type
      apply_link
      job_desc
      name
      company_statement
      logo
      website
      email
      company_desc
      company_id
      location
      created_at
    }
  }
`;

function WorkPosting(props) {
  const { data, error, loading } = useQuery(GET_JOB, {
    variables: {
      id: props.match.params.id
    }
  });

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <div {...props}>
      <WorkElement
        id={'Company'.replace(' ', '-') + 'Title'.replace(' ', '-')}
        logo={data.getJob.company_id}
        job_type={data.getJob.job_type}
        title={data.getJob.job_title}
        company={data.getJob.name}
        type={data.getJob.job_type}
        featured={false}
        apply_link={data.getJob.apply_link}
        location={data.getJob.location}
        date={moment(new Date(parseInt(data.getJob.created_at)))}
      />
      <div className="job-desc">
        <Markdown source={data.getJob.job_desc} />
      </div>
    </div>
  );
}

WorkPosting = styled(WorkPosting)`
  .job-desc {
    margin-left: 22px;
    * {
      color: ${props => (props.theme.is === 'dark' ? props.theme.PALLET['400'] : 'blue')};
    }

    > * {
      margin-bottom: 8px;
    }
    ul,
    ol {
      margin-left: 20px;
    }
  }
`;

export default WorkPosting;
