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
                                    ORDER BY job.created_at DESC
                                        LIMIT $1
                                            OFFSET $2
            `,
        [first, offset]
      );

      console.log(jobs.rows);

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
  },
  Mutation: {
    postJob: async (_, { job: args }, { req }) => {
      console.log(
        chalk.green(`> postJob(${JSON.stringify({ job: args })})`),
        req.user ? req.user.displayName : 'Unknown'
      );

      function decodeBase64Image(dataString) {
        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
          response = {};

        if (matches.length !== 3) {
          return new Error('Invalid input string');
        }

        response.type = matches[1];
        response.data = new Buffer(matches[2], 'base64');

        return response;
      }

      var translator = short();

      let job_id = translator.new();
      let company_id = translator.new();
      // add job to postgreSQL
      await client.query(
        `
                INSERT INTO job (
                    id, title, category, type, apply_link, description, created_at, location
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8
                )
            `,
        [
          job_id,
          args.job_title,
          args.category,
          args.job_type,
          args.apply_link,
          args.job_desc,
          new Date(),
          args.location
        ]
      );

      await client.query(
        `
                INSERT INTO company (
                    id, name, statement, website, email, description, created_at
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7
                );
            `,
        [
          company_id,
          args.name,
          args.company_statement,
          args.website,
          args.email,
          args.company_desc,
          new Date()
        ]
      );

      await client.query(
        `
                INSERT INTO job_company (
                    job_id, company_id
                ) VALUES (
                    $1, $2
                )
            `,
        [job_id, company_id]
      );

      var imageBuffer = decodeBase64Image(args.logo);
      fs.writeFile(`public/logos/${company_id}.png`, imageBuffer.data, function(err) {
        console.log(123, err);
      });

      return {
        id: job_id
      };
    }
  }
};
