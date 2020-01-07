import React, { useState } from "react";

import styled, { withTheme } from "styled-components";
import { desaturate } from "polished";

import date from "date-and-time";

import Button from "./Button";

import {
    DateRangePicker,
    SingleDatePicker,
    DayPickerRangeController
} from "react-dates";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";

import {
    useWindowSize,
    useWindowWidth,
    useWindowHeight
} from "@react-hook/window-size";

import moment from "moment";

import Day from "./Day";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faCalendarWeek } from "@fortawesome/free-solid-svg-icons";

function DayPicker(props) {
    const [date_, setDate] = useState(moment(props.date).startOf("week"));
    const [date__, setDate_] = useState(moment(props.date).endOf("week"));
    const [focused, setFocused] = useState(null);

    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    };

    return (
        <div {...props}>
            <div className="top">
                <DateRangePicker
                    startDate={date_} // momentPropTypes.momentObj or null,
                    startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                    endDate={date__} // momentPropTypes.momentObj or null,
                    endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                    onDatesChange={({ startDate, endDate }) => {
                        setDate(startDate);
                        setDate_(endDate);
                        props.updateDate(startDate);
                        props.goToStep(0);
                    }} // PropTypes.func.isRequired,
                    focusedInput={focused} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                    onFocusChange={focusedInput => setFocused(focusedInput)} // PropTypes.func.isRequired,
                    startDateOffset={day =>
                        day.startOf("week").add(12, "hours")
                    }
                    endDateOffset={day => day.endOf("week").add(-12, "hours")}
                    numberOfMonths={1}
                    displayFormat={"YYYY-MM-DD"}
                    isDayBlocked={() => false}
                    isOutsideRange={day => false}
                />
                <div className="current-day">
                    {date.format(
                        new Date(props.date).addDays(props.currentStep - 2),
                        "YYYY-MM-DD"
                    )}
                </div>
                <Button
                    type="button"
                    active
                    icon={faCalendarWeek}
                    onClick={e => {
                        e.preventDefault();
                        if (focused === null) {
                            setFocused("endDate");
                        } else {
                            setFocused(null);
                        }
                    }}
                ></Button>
            </div>
            <div className="days">
                <Day
                    select={() => {
                        props.goToStep(1);
                    }}
                    day={0}
                    date={date.format(new Date(props.date).addDays(-1), "DD")}
                    active={props.currentStep === 1}
                />
                <Day
                    select={() => {
                        props.goToStep(2);
                    }}
                    day={1}
                    date={date.format(new Date(props.date).addDays(0), "DD")}
                    active={props.currentStep === 2}
                />
                <Day
                    select={() => {
                        props.goToStep(3);
                    }}
                    day={2}
                    date={date.format(new Date(props.date).addDays(1), "DD")}
                    active={props.currentStep === 3}
                />
                <Day
                    select={() => {
                        props.goToStep(4);
                    }}
                    day={3}
                    date={date.format(new Date(props.date).addDays(2), "DD")}
                    active={props.currentStep === 4}
                />
                <Day
                    select={() => {
                        props.goToStep(5);
                    }}
                    day={4}
                    date={date.format(new Date(props.date).addDays(3), "DD")}
                    active={props.currentStep === 5}
                />
                <Day
                    select={() => {
                        props.goToStep(6);
                    }}
                    day={5}
                    date={date.format(new Date(props.date).addDays(4), "DD")}
                    active={props.currentStep === 6}
                />
                <Day
                    select={() => {
                        props.goToStep(7);
                    }}
                    day={6}
                    date={date.format(new Date(props.date).addDays(5), "DD")}
                    active={props.currentStep === 7}
                />
            </div>
        </div>
    );
}

DayPicker = styled(DayPicker)`
    .top {
        display: flex;
        align-items: center;
        ${Button} {
            width: max-content;
        }
    }

    .days {
        display: flex;
        justify-content: space-between;
    }
    background: ${props => (props.theme.is === "dark" ? "#24252d" : "white")};
    /* border: 2px #3d3f52 solid; */
    margin: 8px;
    padding: 12px;
    border-radius: 4px;
    box-shadow: 0px 0px 16px 0px
        ${props =>
        props.theme.is === "dark"
            ? "rgba(0,0,0,0.3)"
            : "rgba(192, 192, 192, 0.3)"};
    border-left: 16px solid
        ${props => (props.theme.is === "dark" ? "#31323d" : "#F3F3F3")};

    .DateRangePickerInput > * {
        display: none;
    }

    .DateRangePickerInput__withBorder {
        border: none;
    }

    .calendar-icon {
        cursor: pointer;
        svg,
        path {
            color: ${props => props.theme.PRIMARY_COLOR};
        }
    }

    .DateRangePickerInput {
        > div {
            /* display: none; */
        }

        .DateRangePicker_picker {
            display: block;
        }
    }

        .SingleDatePicker_picker,
        .DateRangePicker_picker {
            z-index: 100;
        }

        .CalendarDay__selected {
            position: relative;
            color: white;
            overflow: hidden;
            border: none;
            background: ${props => `linear-gradient(to bottom right, ${props.theme.PRIMARY_COLOR}, ${props.theme.SECONDARY_COLOR})`};
            &:hover {
                border: none;
                background: ${props => `linear-gradient(to bottom right, ${props.theme.PRIMARY_COLOR}, ${props.theme.SECONDARY_COLOR})`};
            }
        }

        .CalendarDay__selected_span {
            background: ${props => `linear-gradient(to bottom right, ${desaturate(0.2, props.theme.PRIMARY_COLOR)}, ${desaturate(0.2, props.theme.SECONDARY_COLOR)})`};
            border: none;
            &:hover {
                border: none;
                background: ${props => `linear-gradient(
                    to bottom right,
                    ${props.theme.PRIMARY_COLOR},
                    ${props.theme.SECONDARY_COLOR}
                )`};
            }
        }

        .DayPickerKeyboardShortcuts_show__bottomRight::before {
            border-right-color: ${props =>
        props.theme.SECONDARY_COLOR} !important;
        }

        .DateInput_input__focused {
            border-bottom-color: ${props =>
        props.theme.SECONDARY_COLOR} !important;
        }

    .current-day {
        font-size: 20px;
        color: ${props => (props.theme.is === "dark" ? "white" : "#22222B")};
        flex-grow: 1;
    }
`;

export default withTheme(DayPicker);
