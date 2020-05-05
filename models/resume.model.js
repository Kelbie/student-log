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
  update: async (user_id, json) => {
		// update resume
    await client.query(SQL`
			INSERT INTO resume (
				user_id, 
				json
			) VALUES (
				${user_id}, 
				${json}
			) ON CONFLICT (user_id) 
				DO UPDATE 
					SET 
						json=${json}
		`);
  },
  get: async user_id => {
		// get resume
    return await client.query(
      SQL`
				SELECT json from resume
					WHERE user_id=${user_id}
			`
    );
  }
};
