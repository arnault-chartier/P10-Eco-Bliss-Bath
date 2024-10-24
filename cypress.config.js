const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:8080/#/', // URL de l'application front-end
    apiBaseUrl: 'http://localhost:8081', // URL de l'API
  },
});
