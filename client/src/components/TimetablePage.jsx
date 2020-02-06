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
import { Formik, Field, ErrorMessage } from 'formik';

function Label(props) {
  return <label {...props}>{props.children}</label>;
}

Label = styled(Label)`
  &::after {
    content: ${props => (props.required ? "''" : 'none')};
    width: 8px;
    height: 8px;
    display: inline-block;
    background: #ce428e;
    border-radius: 100%;
    margin-left: 4px;
    vertical-align: middle;
  }
`;

let StyledField = styled(Field)`
  outline: none;
  width: 100%;
  &:required {
    box-shadow: none !important;
  }

  &:invalid {
    box-shadow: 0 0 3px red;
  }
`;

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

  const { data, error, loading } = useQuery(GET_SETTINGS_ICS_LINK);

  console.log(123, data);

  if (error || loading) {
    return <></>;
  }
  if (data.getSettings) {
    if (!data.getSettings.ics_link) {
      return (
        <Formik
          validationSchema={Yup.object().shape({
            ics_link: Yup.string().required('Required')
          })}
          onSubmit={values => {
            postICS({
              variables: {
                ...values
              }
            });
          }}
        >
          {({
            values,
            setValues,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>
              <Label required>ICS Link</Label>
              <StyledField
                required
                type="text"
                name="ics_link"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.ics_link}
              />
              <ErrorMessage name="ics_link" />
              <button type="submit">Submit</button>
            </form>
          )}
        </Formik>
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
