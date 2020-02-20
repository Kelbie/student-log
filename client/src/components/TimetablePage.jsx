import React, { useState, useEffect } from 'react';

import styled from 'styled-components';

import moment from 'moment';

import StepWizard from 'react-step-wizard';

import Timetable from './Timetable';

import DayPicker from './DayPicker';

import * as Yup from 'yup';

// GraphQL
import gql from 'graphql-tag';
import { useQuery, useMutation } from 'react-apollo-hooks';

import { useForm } from 'react-hook-form';
import ButtonRefactor from './common/ButtonRefactor';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import Error from './common/Error';
import Input from './common/Input';
import Label from './common/Label';

const GET_SETTINGS_ICS_LINK = gql`
  query {
    getSettings {
      ics_link
    }
  }
`;

const POST_ICS = gql`
  mutation setICSLink($ics_link: String) {
    setICSLink(ics_link: $ics_link)
  }
`;

function App(props) {
  const [postICS] = useMutation(POST_ICS);

  useEffect(() => {
    document.title = 'Timetable / StudentLog';
  }, []);

  const [selectedDate, setSelectedDate] = useState({
    _d: new Date('2020-01-04')
  });
  const [monday, setMonday] = useState(getMonday(selectedDate._d));

  useEffect(() => {
    setMonday(getMonday(selectedDate._d));
  }, [selectedDate]);

  function onSubmit(values) {
    console.log(values);
    postICS({
      variables: {
        ...values
      }
    });
  }

  const { register, handleSubmit, errors } = useForm();

  const { data, error, loading } = useQuery(GET_SETTINGS_ICS_LINK);

  if (error || loading) {
    return <></>;
  }
  console.log(123, data, data.getSettings, data.getSettings.ics_link);
  if (data.getSettings) {
    if (!data.getSettings.ics_link) {
      return (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Label required>ICS Link</Label>
          <Input ref={register({ required: true })} type="text" name="ics_link" />
          <Error errors={errors} name="ics_link" message={'this field is required'}></Error>
          <ButtonRefactor type="submit" icon={faSave} variant={'fill'}>
            Submit
          </ButtonRefactor>
        </form>
      );
    }
  }

  Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };

  function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return moment(new Date(d.setDate(diff)))
      .add(7, 'days')
      .toDate();
  }

  return (
    <div {...props}>
      <StepWizard nav={<DayPicker date={monday} updateDate={date => setSelectedDate(date)} />}>
        {selectedDate && <Timetable date={monday.addDays(-1)} />}
        {selectedDate && <Timetable date={monday.addDays(0)} />}
        {selectedDate && <Timetable date={monday.addDays(1)} />}
        {selectedDate && <Timetable date={monday.addDays(2)} />}
        {selectedDate && <Timetable date={monday.addDays(3)} />}
        {selectedDate && <Timetable date={monday.addDays(4)} />}
        {selectedDate && <Timetable date={monday.addDays(5)} />}
      </StepWizard>
    </div>
  );
}

App = styled(App)``;

export default App;
