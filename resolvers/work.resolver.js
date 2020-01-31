import chalk from "chalk";

const uuidv4 = require('uuid/v4');

const { Client } = require('pg')
const client = new Client({
    database: "student-log"
})

client.connect()

export default {
    Query: {
        getWork: async (_, { first, offset }, { req }) => {
            console.log(chalk.green(`< getWork(${JSON.stringify({first, offset})})`), req.user ? req.user.displayName : "Unknown");

            let jobs = await client.query(`
                SELECT * FROM job 
                    JOIN job_company 
                        ON job_company.job_id = job.id 
                            JOIN company 
                                ON company.id = job_company.company_id
                                    ORDER BY paid_at
                                        LIMIT $1
                                            OFFSET $2
            `, [first, offset]);

            return jobs.rows.map(job => ({ job_title: job.title, job_type: job.type, job_desc: job.description, ...job }));
        }
    },
    Mutation: {
        postJob: async (_, { job: args }, { req }) => {
            console.log(chalk.green(`> postJob(${JSON.stringify({job: args})})`), req.user ? req.user.displayName : "Unknown");

            let job_id = uuidv4();
            let company_id = uuidv4();
            // add job to postgreSQL
            await client.query(`
                INSERT INTO job (
                    id, title, category, type, apply_link, description, bundle, created_at
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8
                )
            `, [
                job_id,
                args.job_title,
                args.category,
                args.job_type,
                args.apply_link,
                args.job_desc,
                args.bundle,
                new Date()
            ]);

            await client.query(`
                INSERT INTO company (
                    id, name, statement, website, email, description, created_at
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7
                );
            `, [
                company_id,
                args.name,
                args.company_statement,
                args.website,
                args.email,
                args.company_desc,
                new Date()
            ]);

            await client.query(`
                INSERT INTO job_company (
                    job_id, company_id
                ) VALUES (
                    $1, $2
                )
            `, [job_id, company_id])

            return {
                id: job_id
            }
        }
    }
};