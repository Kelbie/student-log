import React from 'react';
import styled from 'styled-components';
import Dropdown from './common/Dropdown';
import Label from './common/Label';
import Button from './Button';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { withRouter } from 'react-router-dom';

function Login(props) {
  return (
    <fieldset {...props}>
      <legend>Verify your student status</legend>
      <Label required>Educational Institution</Label>
      <Dropdown
        options={[
          { label: 'Robert Gordon University', value: 'rgu' },
          { label: 'University of Aberdeen', value: 'UoA' }
        ]}
        onChange={e => {}}
        value={''}
        placeholder="Select an university"
      />
      {/* <Label required>Year of study</Label>
      <Dropdown
        options={['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8']}
        onChange={e => {}}
        value={''}
        placeholder=""
      />
      <Label required>Course length</Label>
      <Dropdown
        options={[
          '1 year',
          '2 years',
          '3 years',
          '4 years',
          '5 years',
          '6 years',
          '7 years',
          '8 years'
        ]}
        onChange={e => {}}
        value={''}
        placeholder=""
      /> */}
      <Button
        icon={faSignInAlt}
        variant={'fill'}
        onClick={() => (window.location.href = `/login?redirect=/`)}
      >
        Student Login
      </Button>
    </fieldset>
  );
}

export default styled(withRouter(Login))`
  border: none;

  padding: 16px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  border: none;
  margin-bottom: 16px;

  legend {
    position: sticky;
    font-weight: 600;
    background: -webkit-linear-gradient(
      ${props => props.theme.PRIMARY_COLOR},
      ${props => props.theme.SECONDARY_COLOR}
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 28px;
  }
`;
