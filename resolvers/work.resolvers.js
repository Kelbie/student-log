require('dotenv').config();

import chalk from 'chalk';

const uuidv4 = require('uuid/v4');
const short = require('short-uuid');
const fs = require('fs');
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
    getWork: async (_, { first, offset }, { req }) => {
      console.log(
        chalk.green(`< getWork(${JSON.stringify({ first, offset })})`),
        req.user ? req.user.displayName : 'Unknown'
      );

      let jobs = await client.query(
        `
                SELECT * FROM job 
                    JOIN job_company 
                        ON job_company.job_id = job.id 
                            JOIN company 
                                ON company.id = job_company.company_id
                                    ORDER BY paid_at
                                        LIMIT $1
                                            OFFSET $2
            `,
        [first, offset]
      );

      console.log(123, jobs);

      return jobs.rows.map(job => ({
        job_title: job.title,
        job_type: job.type,
        job_desc: job.description,
        ...job
      }));
    },
    getJob: async (_, { id }, { req }) => {
      console.log(
        chalk.green(`< getJob(${JSON.stringify({ id })})`),
        req.user ? req.user.displayName : 'Unknown'
      );

      let job = await client.query(
        `
                SELECT title, type, job.description as job_desc, * FROM job 
                    JOIN job_company 
                        ON job_company.job_id = job.id 
                            JOIN company 
                                ON company.id = job_company.company_id
                                    WHERE job_id=$1
            `,
        [id]
      );

      console.log(222, job);

      return job.rows.map(job => ({ job_title: job.title, job_type: job.type, ...job }))[0];
    }
  }
};
