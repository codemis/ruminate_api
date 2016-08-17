/**
 * Configuration settings for each environment
 */
module.exports = function() {
  var settings;
  var path = require('path');
  switch(process.env.NODE_ENV){
  case 'testing':
    settings = {
      android: {
        apiKey: ''
      },
      apple: {
        productionGateway: false,
        certificate: path.join('.', 'cert.pem'),
        key: path.join('.', 'key.pem'),
        passphrase: ''
      },
      port: 8080
    };
    break;
  case 'production':
    settings = {
      android: {
        apiKey: ''
      },
      apple: {
        productionGateway: true,
        certificate: path.join('.', 'cert.pem'),
        key: path.join('.', 'key.pem'),
        passphrase: ''
      },
      port: 8080
    };
    break;
  default:
    settings = {
      android: {
        apiKey: ''
      },
      apple: {
        productionGateway: false,
        certificate: path.join('.', 'cert.pem'),
        key: path.join('.', 'key.pem'),
        passphrase: ''
      },
      port: 8080
    };
    break;
  }
  return settings;
};
