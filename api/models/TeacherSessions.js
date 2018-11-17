/**
 * Teacher_sessions.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const uuid = require('uuid/v1');
const moment = require('moment');

module.exports = {

  tableName: 'teacher_sessions',

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    teacher_session: {
      type: 'string',
      defaultsTo: uuid()
      // required: true
    },

    session_time: {
      type: 'number',
      defaultsTo: 360
    },

    session_started_at: {
      type: 'ref',
      columnType: 'datetime',
      defaultsTo: moment().format("YYYY-MM-DD HH:mm:ss"),
      columnName: 'session_started_at'
    },

    session_ended_at: {
      type: 'ref',
      columnType: 'datetime',
      // defaultsTo: moment().format("YYYY-MM-DD HH:mm:ss"),
      columnName: 'session_ended_at'
    },

    teacher_id: {
      type: 'string'
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

    // teacher: {
    //   model: 'Teachers'
    // }

  },

};
