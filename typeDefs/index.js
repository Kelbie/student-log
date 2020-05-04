import * as path from 'path';
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';
import gql from 'graphql-tag';

// Handle queries
const queries = gql`
  type Query {
    getResume: Resume
    getProfile: Profile
    getWork(first: Int, offset: Int, approved: Boolean): [Job]
    getJob(id: String): Job
  }
`;

// Handle mutations
const mutations = gql`
  type Mutation {
    login: Profile
    updateResume(resume: ResumeInput): Resume
    postJob(job: JobInput): Job
  }
`;

const typesArray = fileLoader(path.join(__dirname, './'));
const typesMerged = mergeTypes([queries, mutations, ...typesArray]);

export default typesMerged;
