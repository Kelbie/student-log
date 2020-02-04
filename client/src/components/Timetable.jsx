import React, { useState, useEffect } from 'react';

import { withRouter } from 'react-router';

import styled from 'styled-components';

// GraphQL
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';

import Timebar from './Timebar';
import Timelabel from './Timelabel';
import Class from './Class';
import Gap from './Gap';
import moment from 'moment';

function calculateGaps(classes) {
  let gaps = [];
  let difference = 0; // Difference in time between classes
  for (let i = 1; i < classes.length; i++) {
    difference = parseInt(classes[i].start) - parseInt(classes[i - 1].end);
    if (difference > 0) {
      gaps.push({
        type: 'gap',
        duration: difference / 3600000,
        start: classes[i - 1].end,
        end: classes[i].start
      });
    }
  }
  return gaps;
}

function calculateDuration(classes) {
  return classes.map(class_ => {
    return {
      ...class_,
      duration: moment
        .unix(parseInt(class_.end) / 1000)
        .diff(moment.unix(parseInt(class_.start) / 1000), 'hour')
    };
  });
}

const GET_CLASSES = gql`
  query getTimetable($date: String) {
    getTimetable(date: $date) {
      id
      type
      start
      end
      module {
        title
        id
      }
      groups {
        name
      }
      staff {
        name
      }
      rooms {
        id
        number
      }
    }
  }
`;

function Timetable(props) {
  const [date, setDate] = useState(props.date);
  const [classes, setClasses] = useState([]);
  const [gaps, setGaps] = useState([]);

  const { data, error, loading } = useQuery(GET_CLASSES, {
    variables: {
      date: String(props.date.getTime())
    }
  });

  useEffect(() => {
    if (data) {
      setClasses(calculateDuration(data.getTimetable));
      setGaps(calculateGaps(data.getTimetable));
    }
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error! {error.message}</div>;
  }

  return (
    <div {...props}>
      {[...Array(24)].map((class_, i) => {
        return (
          <>
            <Timelabel index={i}>
              {classes[0] &&
                moment
                  .unix(parseInt(classes[0].start) / 1000)
                  .add(i, 'hours')
                  .format('HH:mm')}
            </Timelabel>
            <Timebar index={i} />
          </>
        );
      })}
      {[...classes, ...gaps]
        .sort(function(a, b) {
          return a.start > b.start;
        })
        .map(class_ => {
          if (class_.type === 'gap') {
            return (
              <Gap
                index={class_.duration}
                duration={class_.duration}
                start={class_.start}
                end={class_.end}
              />
            );
          } else {
            console.log(class_);
            return (
              <Class
                type={class_.type}
                index={class_.duration}
                title={class_.module.title}
                module={class_.module}
                rooms={class_.rooms}
                start={class_.start}
                end={class_.end}
                duration={class_.duration}
                staff={class_.staff}
              />
            );
          }
        })}
    </div>
  );
}

Timetable = styled(Timetable)`
  display: grid;
  grid-template-columns: min-content auto;
  /* grid-gap: 8px; */
  padding: 8px;
  > ${Class}, ${Gap} {
    margin: 8px;
  }
`;

export default withRouter(Timetable);
