/**
 * Students.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const uuid = require('uuid/v4');
const moment = require('moment');

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    student_id: {
      type: 'string',
      //unique: true,
      defaultsTo: uuid()
    },

    device_id: {
      type: 'string',
      required: true
    },

    registered_at: {
      type: 'ref',
      columnType: 'datetime',
      defaultsTo: moment().format("YYYY-MM-DD HH:mm:ss"),
    },

    teacher_session: {
      type: 'string',
    },

    viewer_id: {
      type: 'string',
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

    // student_session: {
    //   collection: 'StudentSessions',
    //   via: 'student'
    // },
    //
    // teacher_session: {
    //   collection: 'TeacherSessions',
    //   via: 'teacher'
    // }
  },

};
