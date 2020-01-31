import * as path from "path";
import { fileLoader, mergeTypes } from "merge-graphql-schemas";

const queries = `
    type Query {
        getTimetable(date: String): [Class]
        getResume: Resume
        getProfile: Profile
        getWork(first: Int, offset: Int): [Job]
    }
`;

const mutations = `
    type Mutation {
        login: Profile
        setICSLink(ics_link: String): String
        updateResume(resume: ResumeInput): Resume
    }
`;

const typesArray = fileLoader(path.join(__dirname, "./"));
const typesMerged = mergeTypes([queries, mutations, ...typesArray]);

export default typesMerged;