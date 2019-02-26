const initTracerFromEnv = require('jaeger-client').initTracerFromEnv;
module.exports = initTracerFromEnv({}, { 
  logger: console,
  tags: {
    'project.name': process.env.APP_PROJECT_NAME,
  }
});
