/**
 * StudentController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const moment = require('moment');
const uuid = require('uuid/v4');
//const uuid2 = require('uuid/v4');

module.exports = {

  friendlyName: 'Student controller',

  description: 'This is a Student relative REST API controller.',

  inputs: {},

  register: async function (req, res) {
    if (!req.param('device_id')) {
      return res.badRequest({
        error: true, response_code: 1003, data: {
          message: 'Device ID is required.'
        }
      });
    }
    if (!req.param('viewer_id')) {
      return res.badRequest({
        error: true, response_code: 1004, data: {
          message: 'Viewer ID is required.'
        }
      });
    }

    let teacherSession = await TeacherSessions.findOne({session_ended_at: null});
    let teacher_session = null;
    if (teacherSession) {
      teacher_session = teacherSession.teacher_session;
    }

    let student = await Students.findOne({device_id: req.param('device_id')});
    if (student) {
      Students.updateOne({device_id: req.param('device_id')})
        .set({
          device_id: req.param('device_id'),
          student_id: uuid(),
          viewer_id: req.param('viewer_id'),
          teacher_session: teacher_session,
          registered_at: moment().format('YYYY-MM-DD HH:mm:ss')
        })
        .exec((error1, result1) => {
          return res.ok({
            error: false, response_code: 1000, data: {
            message: 'Device registration updated.',
            student_id: result1.student_id
            }
          });
        });
    } else {
      student = await Students.create({
        device_id: req.param('device_id'),
        student_id: uuid(),
        viewer_id: req.param('viewer_id'),
        teacher_session: teacher_session,
        registered_at: moment().format('YYYY-MM-DD HH:mm:ss')
      }).fetch();
      return res.ok({
        error: false, response_code: 1000, data: {
        message: 'New student registered.',
        student_id: student.student_id
        }
      });
    }
  },

  startSession: async function(req, res) {
    if (!req.param('student_id')) {
      return res.badRequest({
        error: true, response_code: 1004, data: {
          message: 'Student ID is required.'
        }
      });
    }
    if (!req.param('viewer_id')) {
      return res.badRequest({
        error: true, response_code: 1004, data: {
          message: 'Viewer ID is required.'
        }
      });
    }

    const student = await Students.findOne({
      student_id: req.param('student_id')
    });

    let studentSession = await StudentSessions.findOne({
      student_id: req.param('student_id')
    });

    if (studentSession) {

      if(studentSession.session_ended_at != null)
      {
        return res.badRequest({
        error: true, response_code: 1004, data: {
          message: 'This student session has ended.'
        }
      });
    }


      StudentSessions.updateOne({student_id: req.param('student_id')})
        .set({
          student_id: req.param('student_id'),
          viewer_id: req.param('viewer_id'),
          teacher_session: student.teacher_session,
          session_started_at: moment().format('YYYY-MM-DD HH:mm:ss'),
          session_timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
          session_ended_at: null
        })
        .exec((error1, result1) => {
          return res.ok({
            error: false, response_code: 1000, data: {
              message: 'Session updated',
              student_session: studentSession.student_session
            }
          });
        });
    } else {
      studentSession = await StudentSessions.create({
        student_session: uuid(),
        student_id: req.param('student_id'),
        viewer_id: req.param('viewer_id'),
        teacher_session: student.teacher_session,
        session_started_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        session_timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
        session_ended_at: null
      }).fetch();
      return res.ok({
        error: false, response_code: 1000, data: {
          message: 'New session started',
          student_session: studentSession.student_session
        }
      });
    }
  },



  collectAnswer: async function(req, res) {
    if (!req.param('event_id')) {
      return res.badRequest({
        error: true, response_code: 1004, data: {
          message: 'Event ID is required.'
        }
      });
    }
    if (!req.param('student_session')) {
      return res.badRequest({
        error: true, response_code: 1004, data: {
          message: 'Student session is required.'
        }
      });
    }
    if (!req.param('module_name')) {
      return res.badRequest({
        error: true, response_code: 1004, data: {
          message: 'Module name is required.'
        }
      });
    }
    if (!req.param('question_text')) {
      return res.badRequest({
        error: true, response_code: 1004, data: {
          message: 'Question text is required.'
        }
      });
    }
    if (!req.param('answer_text')) {
      return res.badRequest({
        error: true, response_code: 1004, data: {
          message: 'Answer text is required.'
        }
      });
    }
    if (!req.param('answer_time')) {
      return res.badRequest({
        error: true, response_code: 1004, data: {
          message: 'Answer time is required.'
        }
      });
    }
    if (!req.param('answer_correctness')) {
      return res.badRequest({
        error: true, response_code: 1004, data: {
          message: 'Answer correctness is required.'
        }
      });
    }

    //1
    //const student = await Students.findOne({
    //  student_session: req.param('student_session')
    //});

    let studentSession = await StudentSessions.findOne({
      student_session: req.param('student_session')
    });

    if (studentSession) {

      if(studentSession.session_ended_at != null)
      {
        return res.badRequest({
        error: true, response_code: 1004, data: {
          message: 'This student session has ended.'
        }
      });
      }


      StudentSessions.updateOne({student_session: req.param('student_session')})
        .set({
          event_id: req.param('event_id'),
          module_name: req.param('module_name'),
          quiz_question_text: req.param('question_text'),
          answer_text: req.param('answer_text'),
          answer_time: req.param('answer_time'),
          is_answer_correct: req.param('answer_correctness'),
          session_timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
        })
        .exec((error1, result1) => {
          return res.ok({
            error: false, response_code: 1000, data: {
              message: 'Answer collected.'
            }
          });
        });
    } else {
      studentSession = await StudentSessions.create({
        event_id: req.param('event_id'),
        module_name: req.param('module_name'),
        quiz_question_text: req.param('question_text'),
        answer_text: req.param('answer_text'),
        answer_time: req.param('answer_time'),
        is_answer_correct: req.param('answer_correctness'),
        session_timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
      }).fetch();
      return res.ok({
        error: false, response_code: 1000, data: {
          message: 'New session answer collected.'
        }
      });
    }
  },




  endSession: async function(req, res) {
    if (!req.param('student_session')) {
      return res.badRequest({
        error: true, response_code: 1004, data: {
          message: 'Student ID is required.'
        }
      });
    }

    let studentSession = await StudentSessions.findOne({
      student_session: req.param('student_session')
    });

    if (studentSession) {
      StudentSessions.updateOne({student_session: req.param('student_session')})
        .set({
          session_timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
          session_ended_at: moment().format('YYYY-MM-DD HH:mm:ss')
        })
        .exec((error1, result1) => {
          return res.ok({
            error: false, response_code: 1000, data: {
              message: 'Session has ended.',
              student_session: studentSession.student_session
            }
          });
        });
    } else {
      return res.badRequest({
        error: true, response_code: 1004, data: {
          message: 'Student session is incorrect.'
        }
      });
    }
  }




};
