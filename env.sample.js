/**
 * Configuration settings for each environment
 */
module.exports = function() {
  var settings;
  switch(process.env.NODE_ENV){
  case 'testing':
    settings = { port: 8080 };
    break;
  case 'production':
    settings = { port: 8080 };
    break;
  default:
    settings = { port: 8080 };
    break;
  }
  return settings;
};
