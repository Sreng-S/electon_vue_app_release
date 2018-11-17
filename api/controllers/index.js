module.exports = {


  friendlyName: 'Index',


  description: 'Display the login page or the chat page, depending on whether there is a logged-in user.',


  inputs: {

  },


  exits: {

    loginPage: {
      responseType: 'view',
      viewTemplatePath: 'pages/login'
    },

    chatPage: {
      responseType: 'view',
      viewTemplatePath: 'pages/chat'
    }

  },


  fn: function (inputs, exits, env) {

    if (!env.req.session.userId) {
      return exits.loginPage({});
    }

    User.findOne({id: env.req.session.userId}).exec(function (err, user) {
      if (err) {
        return exits.error(err);
      }

      if (!user) {
        sails.log.error('No user could be found with the ID currently stored in the session ('
          + env.req.session.userId + ').  Logging out...');
        env.req.session.userId = null;
        return exits.loginPage({});
      }

      if (user.online === false) {
        env.req.session.userId = null;
        return exits.loginPage({});
      }

      return exits.chatPage({
        loggedInUserId: env.req.session.userId,
        username: user.username
      });
    });

  }

};
