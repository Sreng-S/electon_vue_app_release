/**
 * Local environment settings
 *
 * Use this file to specify configuration settings for use while developing
 * the app on your personal system.
 *
 * For more information, check out:
 * https://sailsjs.com/docs/concepts/configuration/the-local-js-file
 */

module.exports = {

  // Any configuration settings may be overridden below, whether it's built-in Sails
  // options or custom configuration specifically for your app (e.g. Stripe, Mailgun, etc.)

  // ssl: {
  //   ca: require('fs').readFileSync(require('path').resolve(__dirname, '../config/ssl/rootCA.crt')),
  //   key: require('fs').readFileSync(require('path').resolve(__dirname, '../config/ssl/server.key')),
  //   cert: require('fs').readFileSync(require('path').resolve(__dirname, '../config/ssl/server.crt'))
  // },

  baseUrl: 'http://localhost:1337',
  explicitHost: '0.0.0.0' || 'localhost',
  port: 1337,
};
