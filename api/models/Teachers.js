/**
 * Teachers.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const uuid = require('uuid/v1');
const moment = require('moment');

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    teacher_id: {
      type: 'string',
      defaultsTo: uuid()
    },

    email: {
      type: 'string',
      required: true,
      unique: true
    },

    password: {
      type: 'string',
      required: true,
      encrypt: true
    },

    username: {
      type: 'string'
    },

    created_at: {
      type: 'ref',
      columnType: 'datetime',
      defaultsTo: moment().format("YYYY-MM-DD HH:mm:ss")
    },

    modified_at: {
      type: 'ref',
      columnType: 'datetime',
      defaultsTo: moment().format("YYYY-MM-DD HH:mm:ss")
    },

    last_login_at: {
      type: 'ref',
      columnType: 'datetime',
      defaultsTo: moment().format("YYYY-MM-DD HH:mm:ss")
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    sync_to_server: {
      type: 'boolean',
      defaultsTo: false
    },

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    // teacher_session: {
    //   collection: 'TeacherSessions',
    //   via: 'teacher'
    // }
  },

};

