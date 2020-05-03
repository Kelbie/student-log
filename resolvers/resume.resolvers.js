require('dotenv').config();

import logger from '../logger';

// Models
import Resume from '../models/resume';

export default {
  Query: {
    getResume: async (_, {}, { req }) => {
      logger('<', 'getResume', null, req, 'green');

      if (!req.isAuthenticated()) {
        return {};
      }

      const resumeResponse = await Resume.get(req.user.upn);

      return JSON.parse(resumeResponse.rows[0].json).resume;
    }
  },
  Mutation: {
    updateResume: async (_, resume, { req }) => {
      logger('>', 'updateResume', { resume }, req, 'green');

      if (!req.isAuthenticated()) {
        return {};
      }

      Resume.update(req.user.upn, JSON.stringify(resume));

      return resume;
    }
  }
};
