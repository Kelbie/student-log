import React, { useState, useEffect, useCallback } from 'react';

import moment from 'moment';

import styled from 'styled-components';

import A from './A';
import WorkElement2 from './WorkElement';
import Button, { Button2 } from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBriefcase, faPlus } from '@fortawesome/free-solid-svg-icons';

// GraphQL
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';

import { useDispatch, useMappedState } from 'redux-react-hook';
import {
  setResults,
  updateFilterType,
  updateFilterCompany,
  updateFilterCategory
} from '../actions/actions';
import _ from 'lodash';

function WorkElement(props) {
  return (
    <div {...props}>
      <div className="photo-container"></div>
      <div className="text">
        <A className="title">{props.title}</A>
        <div className="details">
          <span className="company-name">{props.company}</span>
          <span>•</span>
          <span className="type">{props.type}</span>
        </div>
      </div>
    </div>
  );
}

WorkElement = styled(WorkElement)`
  display: flex;
  background: ${props => (props.theme.is === 'dark' ? '#24252D' : 'white')};
  border-radius: 4px;
  padding: 16px;
  box-shadow: 0px 0px 16px 0px
    ${props => (props.theme.is === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(192, 192, 192, 0.3)')};
  .photo-container {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    background: ${props => (props.theme.is === 'dark' ? '#17171C' : '#F8F7F7')};
    margin-right: 8px;
  }
  .title {
    position: sticky;
    font-weight: 600;
    background: -webkit-linear-gradient(
      ${props => props.theme.PRIMARY_COLOR},
      ${props => props.theme.SECONDARY_COLOR}
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 20px;
  }
  .text {
    color: ${props => (props.theme.is === 'dark' ? '#CBCBCB' : 'black')};
  }
  .details {
    > * {
      margin-right: 4px;
    }
  }
`;

function Filter(props) {
  const dispatch = useDispatch();
  const mapState = useCallback(
    state => ({
      results: state.results
    }),
    []
  );

  const { results } = useMappedState(mapState);

  const [companies, setCompanies] = useState([]);
  const [types, setTypes] = useState([]);
  useEffect(() => {
    if (results) {
      let c = []; // Companies
      let t = []; // Types
      results.map(r => {
        if (!c.includes(r.company)) {
          c.push(r.company);
        }
        if (!t.includes(r.type)) {
          t.push(r.type);
        }
      });
      setCompanies(c);
      setTypes(t);
    }
  }, [results]);

  const [categories, setCategories] = useState([
    'Design',
    'Programming',
    'Customer Support',
    'Copywriting',
    'DevOps & Sysadmin',
    'Sales & Marketing',
    'Business & Management',
    'Finance & Legal',
    'Product',
    'Administrative',
    'Education',
    'Translation & Transcription',
    'Medial/Health',
    'Other'
  ]);

  return (
    <div {...props}>
      <fieldset>
        <legend>By Company:</legend>
        {companies.map(company => {
          return (
            <label>
              <input
                type="checkbox"
                onClick={e => {
                  dispatch(
                    updateFilterCompany({
                      name: company,
                      active: e.target.checked
                    })
                  );
                }}
              />
              {company}
            </label>
          );
        })}
      </fieldset>
      <fieldset>
        <legend>By Employment Type:</legend>
        {types.map(type => {
          return (
            <label>
              <input
                type="checkbox"
                onClick={e => {
                  dispatch(
                    updateFilterType({
                      name: type,
                      active: e.target.checked
                    })
                  );
                }}
              />
              {type}
            </label>
          );
        })}
      </fieldset>
      <fieldset>
        <legend>Related To:</legend>
        {categories.map(category => {
          return (
            <label>
              <input
                type="checkbox"
                onClick={e => {
                  dispatch(
                    updateFilterCategory({
                      name: category,
                      active: e.target.checked
                    })
                  );
                }}
              />
              {category}
            </label>
          );
        })}
      </fieldset>
    </div>
  );
}

Filter = styled(Filter)`
  background: ${props => (props.theme.is === 'dark' ? '#24252D' : 'white')};
  box-shadow: 0px 0px 16px 0px
    ${props => (props.theme.is === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(192, 192, 192, 0.3)')};
  border-radius: 4px;
  padding: 16px;
  color: ${props => (props.theme.is === 'dark' ? '#CBCBCB' : 'black')};
  grid-area: filter;
  fieldset {
    border: none;
    legend {
      font-weight: bold;
    }
    label {
      font-size: 12px;
    }
    > * {
      display: block;
    }
    input {
      margin-right: 4px;
    }
    margin-bottom: 8px;
  }
`;

function Search(props) {
  return (
    <div {...props}>
      <div className="search">
        <FontAwesomeIcon icon={faSearch} />
        <input />
      </div>
      <Button2 active>Search</Button2>
    </div>
  );
}

Search = styled(Search)`
  display: flex;
  flex-direction: row;
  grid-area: search;
  svg {
    align-self: center;
    color: white;
    margin: 8px;
  }
  .search {
    background: -webkit-linear-gradient(
      ${props => props.theme.PRIMARY_COLOR},
      ${props => props.theme.SECONDARY_COLOR}
    );
    border-radius: 4px;
    flex-grow: 1;
    display: flex;
    margin-right: 4px;
  }
  input {
    border: none;
    margin: 2px;
    margin-left: 0px;
    border-radius: 0px 4px 4px 0px;
    padding: 4px 8px;
    background: ${props => (props.theme.is === 'dark' ? '#17171C' : 'white')};
    caret-color: ${props => (props.theme.is === 'dark' ? 'white' : '#17171C')};
    color: ${props => (props.theme.is === 'dark' ? 'white' : '#17171C')};
    flex-grow: 1;
  }
`;

const GET_JOBS = gql`
  query getWork($first: Int, $offset: Int) {
    getWork(first: $first, offset: $offset) {
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

function WorkPage(props) {
  useEffect(() => {
    document.title = 'Work / StudentLog';
  }, []);

  const { data, error, loading } = useQuery(GET_JOBS, {
    variables: {
      first: 20,
      offset: 0
    }
  });

  const mapState = useCallback(
    state => ({
      filter: state.filter
    }),
    []
  );

  const { filter } = useMappedState(mapState);

  const dispatch = useDispatch();
  useEffect(() => {
    if (data) {
      if (data.getWork) {
        dispatch(setResults(data.getWork));
      }
    }
  }, [data]);

  if (error || loading) {
    return <div>Loading...</div>;
  }

  return (
    <div {...props}>
      <Filter />
      {/* <Search /> */}
      <Button variant={'fill'} to="/job/new" icon={faPlus}>
        Post Job
      </Button>
      <div className="list">
        <div className="search-results">{data.getWork.length} results</div>
        {data.getWork
          .filter(function(w) {
            let passType = false;
            console.log(w);
            for (let i = 0; i < filter.types.length; i++) {
              if (w.job_type === filter.types[i].name && filter.types[i].active) {
                passType = true;
              }
            }

            let passCompanies = false;

            for (let i = 0; i < filter.companies.length; i++) {
              if (w.name === filter.companies[i].name && filter.companies[i].active) {
                passCompanies = true;
              }
            }

            let passCategories = false;

            for (let i = 0; i < filter.categories.length; i++) {
              if (w.category === filter.categories[i].name && filter.categories[i].active) {
                passCategories = true;
              }
            }

            if (!passType) {
              passType = filter.types.every(function(el) {
                return !el.active;
              });
            }

            if (!passCompanies) {
              passCompanies = filter.companies.every(function(el) {
                return !el.active;
              });
            }

            if (!passCategories) {
              passCategories = filter.categories.every(function(el) {
                return !el.active;
              });
            }

            return passCompanies && passType && passCategories;
          })
          .map((w, i) => {
            return (
              <WorkElement2
                id={w.id}
                title={w.job_title}
                company={w.name}
                job_type={w.job_type}
                featured={['good', 'better', 'best'].includes(w.bundle) ? true : false}
                date={moment(new Date()).add(-i, 'days')}
              />
            );
          })}
      </div>
    </div>
  );
}

WorkPage = styled(WorkPage)`
  display: grid;
  grid-template-areas:
    'filter search'
    'filter results';
  grid-template-columns: max-content 1fr;
  grid-template-rows: max-content 1fr;
  grid-gap: 8px;
  @media only screen and (max-width: 700px) {
    grid-template-areas:
      'search'
      'filter'
      'results';
    grid-template-columns: 1fr;
  }
  .search-results {
    color: ${props => (props.theme.is === 'dark' ? '#CBCBCB' : 'black')};
  }
  .list {
    grid-area: results;
    flex-grow: 1;
    > * {
      margin-bottom: 8px;
    }
  }
`;

export default WorkPage;
