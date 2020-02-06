require('dotenv').config();

import chalk from 'chalk';

const { Client } = require('pg');
const client = new Client();

client.connect();

export default {
  Mutation: {
    login: async (_, {}, { req }) => {
      return {
        name: `${req.user.name.givenName} ${req.user.name.familyName}`
      };
    },
    setICSLink: async (_, { ics_link }, { req }) => {
      console.log(chalk.green('> setICSLink'), req.user ? req.user.displayName : 'Unknown');

      if (req.isAuthenticated()) {
        client.query(
          `
                    UPDATE users
                        SET ics_link=$1
                            WHERE id=$2
                `,
          [ics_link, req.user.upn]
        );
        return ics_link;
      } else {
        return 'Error';
      }
    }
  },
  Query: {
    getSettings: async (_, {}, { req }) => {
      if (!req.isAuthenticated()) {
        return null;
      }

      let user = await client.query(
        `
                SELECT * FROM users
                    WHERE id=$1
            `,
        [req.user.upn]
      );

      return {
        ics_link: user.rows[0].ics_link
      };
    },
    getProfile: async (_, {}, { req }) => {
      if (req.user) {
        return {
          name: `${req.user.name.givenName} ${req.user.name.familyName}`
        };
      }
      return { name: null };
    }
  }
};
