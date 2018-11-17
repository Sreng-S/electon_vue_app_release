/**
 * Student_sessions.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const moment = require('moment');

module.exports = {

  tableName: 'student_sessions',

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    //student_session: {
    //  type: 'string'
    //},
    event_id: {
      type: 'string'
    },

    student_id: {
      type: 'string'
    },

    viewer_id: {
      type: 'string'
    },

    module_name: {
      type: 'string'
    },

    quiz_question_text: {
      type: 'string'
    },

    answer_text: {
      type: 'string'
    },

    answer_time: {
      type: 'ref',
      columnType: 'time'
    },

    is_answer_correct: {
      type: 'boolean'
    },

    session_started_at: {
      type: 'ref',
      columnType: 'datetime',
      defaultsTo: moment().format("YYYY-MM-DD HH:mm:ss")
    },

    session_timestamp: {
      type: 'ref',
      columnType: 'datetime',
      defaultsTo: moment().format("YYYY-MM-DD HH:mm:ss")
    },

    session_ended_at: {
      type: 'ref',
      columnType: 'datetime',
      // defaultsTo: moment().format("YYYY-MM-DD HH:mm:ss")
    },

    student_session: {
      type: 'string',
    },

    teacher_session: {
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

    // student: {
    //   model: 'students'
    // },

    // teacher: {
    //   model: 'Teachers'
    // }

  },

};
