import { fromURL } from '../models/timetable';

import moment from 'moment';

import chalk from 'chalk';

const { Client } = require('pg');
const client = new Client({
  database: 'student-log'
});

client.connect();

let timetable = null;

export default {
  Query: {
    getTimetable: async (_, { date }, { req }) => {
      console.log(
        chalk.green(`< getTimetable(${JSON.stringify({ date })})`),
        req.user ? req.user.displayName : 'Unknown'
      );

      if (!req.isAuthenticated()) {
        return [];
      }
      let users = await client.query(
        `
                SELECT * FROM users
                    WHERE id=$1
            `,
        [req.user.upn]
      );

      if (!users.rows[0].ics_link) {
        return { ics_link: null };
      }

      let data;
      if (!timetable) {
        data = await fromURL(users.rows[0].ics_link);
        timetable = data;
      } else {
        data = timetable;
      }
      // console.log(data);

      // https://timetables.rgu.ac.uk/iCal/ical/ical/QF2DXRCL547645/schedule.ics

      let classes = [];

      let keys = Object.keys(data).filter(function(key) {
        let day1 = parseInt(data[key].start.getTime()) / 1000;
        let day2 = parseInt(date) / 1000;
        let isSame = moment.unix(day1).isSame(moment.unix(day2), 'date');
        return isSame;
      });

      keys.map(key => {
        let class_ = {
          id: key,
          start: data[key].start,
          end: data[key].end
        };
        const description_split = data[key].description.split('\n');
        const d = description_split.map(row => {
          const row_split = row.split(':');
          let rooms, staff, groups;
          switch (row_split[0]) {
            case 'Room':
              rooms = row_split[1].split(';');
              return rooms.map(room => {
                return { id: room.trim(), number: room.trim().split(' ')[0] };
              });
            case 'Staff':
              staff = row_split[1].split(';');
              return staff.map(staff => {
                let first = staff.split(',')[1];
                let last = staff.split(',')[0];
                return {
                  name: `${first.trim()} ${last.trim()}`
                };
              });
            case 'Group':
              groups = row_split[1].split(';');
              return groups.map(group => {
                return { name: group.trim() };
              });
            case 'Module':
              if (row_split[1].trim() === 'Non-Modular Event') {
                return {
                  title: row_split[1].trim()
                };
              }
              let module = row_split[1].split('-');
              return {
                title: module[0].trim(),
                id: module[1].trim()
              };
            case 'Event category':
              return { type: row_split[1] };
          }
          return {};
        });
        classes.push({
          ...class_,
          rooms: d[1],
          groups: d[4],
          staff: d[3],
          module: d[0],
          type: d[2].type
        });
      });

      return classes;
    }
  }
};
