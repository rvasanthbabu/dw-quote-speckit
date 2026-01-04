import { defineConfig } from 'cypress';
import codeCoverageTask from '@cypress/code-coverage/task.js';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.js',
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);
      return config;
    },
  },
  env: {
    codeCoverage: {
      exclude: ['cypress/**/*.*'],
    },
  },
});
