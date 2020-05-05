require('dotenv').config();

import SQL from 'sql-template-strings';

import { decodeBase64Image } from '../helper';

const fs = require('fs');

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
  get: async id => {
		// join to combine jobs with company
    return await client.query(
      SQL`
					SELECT title, type, job.description as job_desc, * FROM job 
							JOIN job_company 
									ON job_company.job_id = job.id 
											JOIN company 
													ON company.id = job_company.company_id
															WHERE job_id=${id}
				`
    );
  },
  getMultiple: async (first, offset) => {
		// join to combile all jobs with their companies
    return await client.query(
      SQL`
						SELECT * FROM job 
								JOIN job_company 
										ON job_company.job_id = job.id 
												JOIN company 
														ON company.id = job_company.company_id
																WHERE job.approved=TRUE
																	ORDER BY job.created_at DESC
																			LIMIT ${first}
																					OFFSET ${offset}
					`
    );
  },
  create: async (job, company) => {
    // add job to postgreSQL
    await client.query(
      SQL`
				INSERT INTO job (
						id, title, category, type, apply_link, description, created_at, location, approved
				) VALUES (
						${job.id}, 
						${job.title}, 
						${job.category}, 
						${job.type}, 
						${job.apply_link}, 
						${job.desc}, 
						${new Date()}, 
						${job.location}, 
						TRUE
				)
			`
    );

		// insert company into db
    await client.query(
      SQL`
				INSERT INTO company (
						id, name, statement, website, email, description, created_at
				) VALUES (
						${company.id}, 
						${company.name}, 
						${company.statement}, 
						${company.website}, 
						${company.email}, 
						${company.desc}, 
						${new Date()}
				);
			`
    );

    await client.query(
      SQL`
          INSERT INTO job_company (
              job_id, company_id
          ) VALUES (
              ${job.id}, ${company.id}
          )
        `
    );

    // Save image to disk
    var imageBuffer = decodeBase64Image(company.logo);
    fs.writeFile(`public/logos/${company.id}.png`, imageBuffer.data, function(err) {});
  }
};
