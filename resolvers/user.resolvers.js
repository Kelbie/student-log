require('dotenv').config();

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
