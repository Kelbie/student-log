import * as path from 'path';
import { fileLoader } from 'merge-graphql-schemas';

// grabs all the resolvers and exports them
const resolvers = fileLoader(path.join(__dirname, './**/*.resolvers.*'));

export default resolvers;
