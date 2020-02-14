import React, { useState } from 'react';
import styled from 'styled-components';
import Dropdown from './common/Dropdown';
import Label from './common/Label';
import Button from './common/Button';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { withRouter } from 'react-router-dom';
import ButtonRefactor from './common/ButtonRefactor';

function Login(props) {
  const [uni, setUni] = useState('');
  return (
    <fieldset {...props}>
      <legend>Verify your student status</legend>
      <Label required>Educational Institution</Label>
      <Dropdown
        options={[
          { label: 'Robert Gordon University', value: 'rgu.ac.uk' },
          { label: 'University of Aberdeen', value: 'abdn.ac.uk' },
          { label: 'The University of Edinburgh', value: 'ed.ac.uk' },
          { label: 'North East Scotland College', value: 'nescol.ac.uk' },
          { label: 'University of Glasgow', value: 'gla.ac.uk' },
          { label: 'University of Strathclyde', value: 'strath.ac.uk' },
          { label: 'Harvard University', value: 'harvard.edu' },
          { label: 'University of Oxford', value: 'ox.ac.uk' },
          { label: 'University of Cambridge', value: 'cam.ac.uk' },
          { label: 'University of St Andrews', value: 'st-andrews.ac.uk' },
          { label: 'University of the West of Scotland', value: 'uws.ac.uk' },
          { label: 'Heriot Watt University', value: 'hw.ac.uk' },
          { label: 'University of Pennsylvania', value: 'upenn.edu' },
          { label: 'Cornell University', value: 'cornell.edu' },
          { label: 'McGill University', value: 'mcgill.ca' },
          { label: 'Glasgow Caledonian University', value: 'gcu.ac.uk' },
          { label: 'University of Stirling', value: 'stir.ac.uk' },
          { label: 'University of Dundee', value: 'dundee.ac.uk' },
          { label: 'Edinburgh Napier University', value: 'napier.ac.uk' },
          { label: 'Glasgow School of Art', value: 'gsa.ac.uk' },
          { label: 'Royal Conservatoire of Scotland', value: 'rcs.ac.uk' }
        ]}
        onChange={({ value }) => {
          setUni(value);
        }}
        value={uni}
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
      <ButtonRefactor
        icon={faSignInAlt}
        variant={'fill'}
        onClick={() => (window.location.href = `/login?uni=${uni}&redirect=/`)}
      >
        Student Login
      </ButtonRefactor>
    </fieldset>
  );
}

export default styled(withRouter(Login))`
  border: none;

  padding: 16px;
  border-radius: 4px;
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
