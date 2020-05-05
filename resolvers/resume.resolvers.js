require('dotenv').config();

import logger from '../logger';

// Models
import Resume from '../models/resume.model';

export default {
  Query: {
    getResume: async (_, {}, { req }) => {
      logger('<', 'getResume', null, req, 'green');

      // check if the user is logged in
      if (!req.isAuthenticated()) {
        return {};
      }

      // get json resume
      const resumeResponse = await Resume.get(req.user.upn);

      // return json resume
      return JSON.parse(resumeResponse.rows[0].json).resume;
    }
  },
  Mutation: {
    updateResume: async (_, resume, { req }) => {
      logger('>', 'updateResume', { resume }, req, 'green');

      // check if user is authenticated
      if (!req.isAuthenticated()) {
        return {};
      }

      const jsonString = JSON.stringify(resume);

      // sanity check
      if (jsonString.length < 25000) {
        Resume.update(req.user.upn, JSON.stringify(resume));
      } else {
        throw new Error("Resume too long to render");
      }
    }
  }
};
