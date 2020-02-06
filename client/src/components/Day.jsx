import React, { useState } from 'react';

import styled, { withTheme } from 'styled-components';
import { desaturate } from 'polished';

import date from 'date-and-time';

import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import { useWindowSize, useWindowWidth, useWindowHeight } from '@react-hook/window-size';

import moment from 'moment';

function Day(props) {
  const width = useWindowWidth();
  let days = ['SAT', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SUN'];
  return (
    <div {...props}>
      <button onClick={() => props.select()}>
        <div className="day-of-the-week">{width < 600 ? days[props.day][0] : days[props.day]}</div>
        <div className="day-of-the-month">{props.date}</div>
      </button>
    </div>
  );
}

export default styled(Day)`
  button {
    display: flex;
    flex-direction: column;
    appearance: none;
    background: none;
    border: none;
    background: -webkit-linear-gradient(${props =>
      props.active
        ? props.theme.PRIMARY_COLOR
        : props.theme.is === 'dark'
        ? 'white'
        : '#22222B'}, ${props =>
  props.active ? props.theme.SECONDARY_COLOR : props.theme.is === 'dark' ? 'white' : '#22222B'});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 18px;
    padding: 8px;
    cursor: pointer;

    position: relative;
    text-decoration: none;

    /* &:after {
        content: "";
        transition: 0.3s ease 0s;
        bottom: 0;
        left: 0;
        width: ${props => (props.active ? '100%' : '0%')};
        position: absolute;
        height: 1px;
        background: -webkit-linear-gradient(${props =>
          props.active ? props.theme.PRIMARY_COLOR : 'white'}, ${props =>
  props.active ? props.theme.SECONDARY_COLOR : 'white'});
    }

    &:hover:after {
        width: 100%;
    } */

    .day-of-the-week {
      opacity: 0.5;
    }

    .day-of-the-month {
      font-weight: bold;
      /* text-decoration: ${props => (props.active ? 'underline' : 'none')}; */
    }
  }
`;
