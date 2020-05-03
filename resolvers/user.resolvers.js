require('dotenv').config();

import sql from 'sql-template-strings';

export default {
  Mutation: {
    login: async (_, {}, { req }) => {
      return {
        name: `${req.user.name.givenName} ${req.user.name.familyName}`
      };
    }
  },
  Query: {
    getProfile: async (_, {}, { req }) => {
      if (req.user) {
        return {
          name: `${req.user.name.givenName} ${req.user.name.familyName}`,
          email: req.user.upn
        };
      }
      return { name: null };
    }
  }
};
