require('dotenv').config();

import SQL from 'sql-template-strings';

// Postgres
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
  create: async (id) => {
    await client.query(
      SQL`
            INSERT INTO users (
                id
            ) VALUES (
                ${id}
            ) ON CONFLICT 
                DO NOTHING
      `,
    );
  }
}