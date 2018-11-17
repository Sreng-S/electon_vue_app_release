/**
 * TeacherController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const uuid = require('uuid/v1');
const moment = require('moment');
const jwt = require('jsonwebtoken');

module.exports = {

  friendlyName: 'Login Teachers',

  description: 'This is a Teacher relative REST API controller.',

  inputs: {},

  // login the current teacher
  login: async function (req, res) {

    // ---------------------------------------------------------------------------------------------- TEST CASE
    let sampleUsers = ['teacher1@getmedi.com', 'teacher2@getmedi.com', 'teacher3@getmedi.com'];
    for (let i = 0; i < sampleUsers.length; i++) {
      const isExist = await Teachers.count({
        email: sampleUsers[i]
      });
      if (!isExist) {
        await Teachers.create({
          email: sampleUsers[i],
          password: 'medip@ss'
        });
      }
    }
    // ----------------------------------------------------------------------------------------------

    if (!req.param('username')) {
      return res.badRequest({
        error: true, response_code: 1001, data: {
          message: 'Username is required.'
        }
      });
    }

    if (!req.param('password')) {
      return res.badRequest({
        error: true, response_code: 1001, data: {
          message: 'Password is required.'
        }
      });
    }

    let teacher = await Teachers.findOne({
      email: req.param('username')
    }).decrypt();

    if (!teacher) {
      return res.badRequest({
        error: true, response_code: 1001, data: {
          message: 'Username or password is not correct'
        }
      });
    }

    if (teacher.password !== req.param('password')) {
      return res.badRequest({
        error: true, response_code: 1001, data: {
          message: 'Username or password is not correct'
        }
      });
    }

    const accessToken = jwt.sign({
      user: teacher.teacher_id,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
      data: 'foobar'
    }, 'secret');

    // Set the user ID in the session.
    req.session.userId = teacher.id;

    res.cookie('sailsjwt', accessToken, {
      signed: true,
      maxAge: ''
    });

    return res.ok({
      error: false, response_code: 1000, data: {
        teacher_id: teacher.teacher_id,
        accessToken: accessToken,
      }
    });
  },

  // create a new teacher account
  register: async function (req, res) {

    if (!req.param('email')) {
      return res.badRequest({
        error: true, response_code: 1001, data:
          {message: 'Email address is required.'}
      });
    }

    const isExist = await Teachers.count({
      email: req.param('email')
    });
    if (isExist) {
      res.badRequest({
        error: true, response_code: 1001, data: {
          message: 'This email is already exist'
        }
      });
    }

    if (!req.param('password')) {
      return res.badRequest({
        error: true, response_code: 1001, data: {
          message: 'Password is required.'
        }
      });
    }

    if (req.param('password').length < 8) {
      return res.badRequest({
        error: true, response_code: 1001, data: {
          message: 'Password must be at least 8 characters.'
        }
      });
    }

    if (!req.param('username')) {
      return res.badRequest({
        error: true, response_code: 1001, data: {
          message: 'Username is required'
        }
      });
    }

    const attr = {
      email: req.param('email'),
      password: req.param('password'),
      username: req.param('username')
    };

    const teacher = await Teachers.create(attr).fetch();
    const accessToken = jwt.sign({
      user: teacher.teacher_id,
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      data: 'foobar'
    }, 'secret');

    // res.cookie('sailsjwt', accessToken, {
    //   signed: true,
    //   maxAge: ''
    // });

    return res.ok({
      error: false, response_code: 1000, data: {
        teacher_id: teacher.teacher_id,
        accessToken: accessToken,
      }
    });
  },

  startSession: function (req, res) {

    if (!req.param('teacher_id')) {
      return res.badRequest({
        error: true, response_code: 1002, data: {
          message: 'Teacher_id is required.'
        }
      });
    }

    if (!req.param('accessToken')) {
      return res.badRequest({
        error: true, response_code: 1002, data: {
          message: 'AccessToken is required.'
        }
      });
    }

    jwt.verify(req.param('accessToken'), 'secret', async (error, result) => {
      if (error) {
        return res.badRequest({
          error: true, response_code: 1002, data: {
            message: 'Invalid token provided'
          }
        });
      }

      let teacherSession = await TeacherSessions.findOne({
        teacher_id: result.user
      });
      if (teacherSession) {

        TeacherSessions.updateOne({teacher_id: result.user})
          .set({
            teacher_session: uuid(),
            session_started_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            session_ended_at: null
          })
          .exec((error1, result1) => {
            return res.ok({
              error: false, response_code: 1000, data: {
                teacher_session: result1.teacher_session
              }
            });
          });
      } else {
        teacherSession = await TeacherSessions.create({
          teacher_id: result.user
        }).fetch();
        return res.ok({
          error: false, response_code: 1000, data: {
            teacher_session: teacherSession.teacher_session
          }
        });
      }
    });
  },




  endSession: function (req, res) {

    if (!req.param('teacher_session')) {
      return res.badRequest({
        error: true, response_code: 1002, data: {
          message: 'Teacher session is required.'
        }
      });
    }

    if (!req.param('accessToken')) {
      return res.badRequest({
        error: true, response_code: 1002, data: {
          message: 'AccessToken is required.'
        }
      });
    }

    jwt.verify(req.param('accessToken'), 'secret', async (error, result) => {
      if (error) {
        return res.badRequest({
          error: true, response_code: 1002, data: {
            message: 'Invalid token provided'
          }
        });
      }

      let teacherSession = await TeacherSessions.findOne({
        teacher_session: req.param('teacher_session')
      });
      if (teacherSession) {

        TeacherSessions.updateOne({teacher_session: req.param('teacher_session')})
          .set({
            session_ended_at: moment().format('YYYY-MM-DD HH:mm:ss')
          })
          .exec((error1, result1) => {
            return res.ok({
              error: false, response_code: 1000, data: {
                message: 'Teacher session has ended.',
                teacher_session: result1.teacher_session
              }
            });
          });
      } else {
        return res.badRequest({
          error: true, response_code: 1004, data: {
            message: 'Teacher session is incorrect.'
          }
        });
      }
    });
  }



};
