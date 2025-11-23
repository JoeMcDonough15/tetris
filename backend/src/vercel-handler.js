module.exports = async (req, res) => {
  // Import the compiled serverless function
  const handler = require('../dist/serverless.js');
  return handler.default(req, res);
};
