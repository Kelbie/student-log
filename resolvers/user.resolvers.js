require('dotenv').config();

export default {
  Mutation: {
    login: async (_, {}, { req }) => {
      // get logged in user from context
      return {
        name: `${req.user.name.givenName} ${req.user.name.familyName}`
      };
    }
  },
  Query: {
    getProfile: async (_, {}, { req }) => {
      // if the user isn't authenticate then don't proceed.
      if (!req.isAuthenticated()) {
        return {};
      }

      return {
        name: `${req.user.name.givenName} ${req.user.name.familyName}`,
        email: req.user.upn
      };
    }
  }
};
