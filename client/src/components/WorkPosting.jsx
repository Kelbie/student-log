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
      bundle
    }
  }
`;

function WorkPosting(props) {
  console.log(props.match.params.id);
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
        logo={data.getJob.logo}
        job_type={data.getJob.job_type}
        title={data.getJob.job_title}
        company={data.getJob.name}
        type={data.getJob.job_type}
        featured={false}
        apply_link={data.getJob.apply_link}
        date={moment(new Date()).add(1, 'days')}
      />
      <div className="job-desc">
        <Markdown source={data.getJob.job_desc} />
      </div>
    </div>
  );
}

WorkPosting = styled(WorkPosting)`
  ${Markdown} {
    * {
      color: ${props => (props.theme.is === 'dark' ? '#E0E0E0' : '#17171C')};
      font-family: Montserrat;
    }
    ul {
      margin-left: 20px;
    }
  }
`;

export default WorkPosting;
