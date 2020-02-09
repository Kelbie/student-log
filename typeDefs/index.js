import * as path from 'path';
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';
import gql from 'graphql-tag';

const queries = gql`
  type Query {
    getTimetable(date: String): [Class]
    getResume: Resume
    getProfile: Profile
    getWork(first: Int, offset: Int): [Job]
    getJob(id: String): Job
    getSettings: Settings
  }
`;

const mutations = gql`
  type Mutation {
    login: Profile
    setICSLink(ics_link: String): String
    updateResume(resume: ResumeInput): Resume
    postJob(job: JobInput): Job
  }
`;

const typesArray = fileLoader(path.join(__dirname, './'));
const typesMerged = mergeTypes([queries, mutations, ...typesArray]);

export default typesMerged;
