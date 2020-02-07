import sql from 'sql-template-strings';
import logger from '../logger';

const { Client } = require('pg');

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDB,
  password: process.env.PGPASS,
  port: process.env.PGPORT
});

client.connect();

export default {
  Query: {
    getResume: async (_, {}, { req }) => {
      logger('<', 'getResume', null, req, 'green');

      if (!req.isAuthenticated()) {
        return {};
      }

      const resumeResponse = client.query(
        sql`
          SELECT json from resume
            WHERE user_id=${req.user.upn}
        `,
        []
      );

      return JSON.parse(resumeResponse.rows[0].json);
    }
  },
  Mutation: {
    updateResume: async (_, resume, { req }) => {
      logger('>', 'updateResume', { resume }, req, 'green');

      if (!req.isAuthenticated()) {
        return {};
      }

      const query = `
        INSERT INTO resume (
          user_id, 
          json
        ) VALUES (
            '${req.user.upn}', 
            '${JSON.stringify(resume)}'
          ) ON CONFLICT (user_id) 
              DO UPDATE 
                SET 
                  json='${JSON.stringify(resume)}'
      `;

      console.log(query);

      client.query(query);

      return resume;
    }
  }
};
