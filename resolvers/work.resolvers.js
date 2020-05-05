require('dotenv').config();

import chalk from 'chalk';

const short = require('short-uuid');

const fs = require('fs');

import Work from '../models/work.model';

export default {
  Query: {
    getWork: async (_, { first, offset }, { req }) => {
      console.log(
        chalk.green(`< getWork(${JSON.stringify({ first, offset })})`),
        req.user ? req.user.displayName : 'Unknown'
      );

      // get alls the jobs
      let jobs = await Work.getMultiple(first, offset);

      // export jobs to graphql
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

      // get job
      let job = await Work.get(id);

      // export job to graphql
      return job.rows.map(job => ({ job_title: job.title, job_type: job.type, ...job }))[0];
    }
  },
  Mutation: {
    postJob: async (_, { job: args }, { req }) => {
      console.log(
        chalk.green(`> postJob(${JSON.stringify({ job: args })})`),
        req.user ? req.user.displayName : 'Unknown'
      );

      var translator = short();
      
      // create a short unique id for job and company
      let job_id = translator.new();
      let company_id = translator.new();

      // sanity checks
      if (args.job_title == "" || args.job_title.length > 128) {
        throw new Error('invalid job title');
      }
      if (
        ![
          'Design',
          'Programming',
          'Customer Support',
          'Copywriting',
          'DevOps & Sysadmin',
          'Sales & Marketing',
          'Business & Management',
          'Finance & Legal',
          'Product',
          'Administrative',
          'Education',
          'Translation & Transacription',
          'Medial/Health',
          'Other'
        ].includes(args.category)
      ) {
        throw new Error('Invalid job category');
      }
      if (!['Full-time', 'Internship', 'Project'].includes(args.job_type)) {
        throw new Error('Invalid job type');
      }
      if (args.apply_link == "" || args.apply_link.length > 256) {
        throw new Error("invalid apply link");
      }
      try {
        new URL(args.apply_link);
      } catch(err) {
        throw new Error("invalid apply link");
      }
      if (args.job_desc == "" || args.job_desc.length > 25000) {
        throw new Error("invalid job desc");
      }
      if (args.location == "" || args.location.length > 64) {
        throw new Error("invalid location");
      }
      if (args.logo == "" || args.logo.length === 0) {
        throw new Error('invalid logo');
      }

      if (company_id == "" || company_id.length > 25) {
        throw new Error('invalid company id');
      }
      if (args.name == "" || args.name.length > 128) {
        throw new Error('invalid name');
      }
      if (args.company_statement == "" || args.company_statement.length > 256) {
        throw new Error('invalid statement');
      }
      if (args.website == "" || args.website.length > 256) {
        throw new Error('invalid website');
      }
      try {
        new URL(args.website);
      } catch(err) {
        throw new Error("invalid website");
      }
      if (args.email == "" || args.email.length > 70) {
        throw new Error('invalid email');
      }
      try {
        new URL(args.email);
      } catch(err) {
        throw new Error("invalid email");
      }
      if (args.company_desc == "" || args.company_desc.length > 256) {
        throw new Error('invalid description');
      }

      // create a job post and store in db
      await Work.create(
        {
          id: job_id,
          title: args.job_title,
          category: args.category,
          type: args.job_type,
          apply_link: args.apply_link,
          desc: args.job_desc,
          location: args.location
        },
        {
          id: company_id,
          name: args.name,
          statement: args.company_statement,
          website: args.website,
          email: args.email,
          desc: args.desc,
          logo: args.logo
        }
      );

      // export id to graphql
      return {
        id: job_id
      };
    }
  }
};
