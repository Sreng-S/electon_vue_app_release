/**
 * UtilityController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const sails = require('sails');

module.exports = {

  friendlyName: 'Utility Controller',

  description: 'This is a Utility REST API controller.',

  resetDatabase: async function (req, res) {

    // Remove all records
    let models = sails.models;
    for (let id in models) {
      await models[id].destroy({});
    }

    return res.ok({
      error: false,
      response_code: 1000,
      data: {
        message: 'Reset Database!',
      }
    });
  },

  syncDatabase: async function(req, res) {

    const Driver = sails.getDatastore('azureDriver').driver;
    const Manger = sails.getDatastore('azureDriver').manager;

    let db;
    try {
      db = (
        await Driver.getConnection({manager: Manger})
      ).connection;

      const tableTeacherSql = `CREATE TABLE IF NOT EXISTS teachers (
        teacher_id varchar(255), 
        email varchar(255) NOT NULL,
        password varchar(255),
        username varchar(255),
        last_login_at TIMESTAMP,
        created_at TIMESTAMP,
        modified_at TIMESTAMP,
        PRIMARY KEY (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`;

      await Driver.sendNativeQuery({
        connection: db,
        nativeQuery: tableTeacherSql
      });

      const tableTeacherSessionSql = `CREATE TABLE IF NOT EXISTS teacher_sessions (
        teacher_session varchar(255) NOT NULL,
        session_time int DEFAULT 360,
        session_started_at TIMESTAMP,
        session_ended_at TIMESTAMP DEFAULT NULL,
        teacher_id varchar(255),
        PRIMARY KEY (teacher_session)
        ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`;

      await Driver.sendNativeQuery({
        connection: db,
        nativeQuery: tableTeacherSessionSql
      });

      const tableStudentSql = `CREATE TABLE IF NOT EXISTS students (
        student_id varchar(255) NOT NULL,
        device_id varchar(255),
        registered_at TIMESTAMP,
        teacher_session varchar(255),
        viewer_id varchar(255),
        PRIMARY KEY (device_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`;

      await Driver.sendNativeQuery({
        connection: db,
        nativeQuery: tableStudentSql
      });

      const tableStudentSessionSql = `CREATE TABLE IF NOT EXISTS student_sessions (
        event_id varchar(255),
        student_id varchar(255),
        viewer_id varchar(255),
        module_name varchar(255),
        quiz_question_text LONGTEXT,
        answer_text LONGTEXT,
        answer_time time,
        is_answer_correct TINYINT,
        session_started_at TIMESTAMP,
        session_timestamp TIMESTAMP,
        session_ended_at TIMESTAMP DEFAULT NULL,
        student_session varchar(255) NOT NULL,
        teacher_session varchar(255),
        PRIMARY KEY (student_session)
        ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`;

      await Driver.sendNativeQuery({
        connection: db,
        nativeQuery: tableStudentSessionSql
      });

      const tableModuleSql = `CREATE TABLE IF NOT EXISTS modules (
        module_name varchar(255) NOT NULL,
        quiz_data LONGTEXT,
        package LONGTEXT,
        PRIMARY KEY (module_name)
        ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`;

      await Driver.sendNativeQuery({
        connection: db,
        nativeQuery: tableModuleSql
      });

      const models = sails.models;
      for (let id in models) {
        if (!['modules', 'teachers', 'students', 'teachersessions', 'studentsessions'].includes(id)) {
          continue;
        }
        const data = await models[id].find({sync_to_server: false});
        console.log(data);

        for (let i=0; i<data.length; i++) {
          let sql = '';
          if (id === 'modules') {
            sql = `INSERT INTO modules VALUES('${data[i].module_name}', '${data[i].quiz_data}', '${data[i].package}')`;
            Modules.updateOne({module_name: data[i].module_name})
              .set({
                sync_to_server: true
              })
              .exec((error, result) => {
                console.log(error, result);
              });
          } else if (id === 'students') {
            sql = `INSERT INTO students VALUES('${data[i].student_id}', '${data[i].device_id}', '${data[i].registered_at}', '${data[i].teacher_session}', '${data[i].viewer_id}')`;
            Students.updateOne({student_id: data[i].student_id})
              .set({
                sync_to_server: true
              })
              .exec((error, result) => {
                console.log(error, result);
              });
          } else if (id === 'teachers') {
            sql = `INSERT INTO teachers VALUES('${data[i].teacher_id}', '${data[i].email}', '${data[i].password}', '${data[i].username}', '${data[i].created_at}', '${data[i].modified_at}', '${data[i].last_login_at}')`;
            Teachers.updateOne({teacher_id: data[i].teacher_id})
              .set({
                sync_to_server: true
              })
              .exec((error, result) => {
                console.log(error, result);
              });
          } else if (id === 'teachersessions') {
            sql = `INSERT INTO teacher_sessions VALUES('${data[i].teacher_session}', '${data[i].session_time}', '${data[i].session_started_at}', '${data[i].session_ended_at}', '${data[i].teacher_id}')`;
            TeacherSessions.updateOne({teacher_session: data[i].teacher_session})
              .set({
                sync_to_server: true
              })
              .exec((error, result) => {
                console.log(error, result);
              });
          } else if (id === 'studentsessions') {
            sql = `INSERT INTO student_sessions VALUES('${data[i].event_id}', '${data[i].student_id}', '${data[i].viewer_id}', '${data[i].module_name}', '${data[i].quiz_question_text}', '${data[i].answer_text}', '${data[i].answer_time}', '${data[i].is_answer_correct}', '${data[i].session_started_at}', '${data[i].session_timestamp}', '${data[i].session_ended_at}', '${data[i].student_session}', '${data[i].teacher_session}')`;
            StudentSessions.updateOne({student_session: data[i].student_session})
              .set({
                sync_to_server: true
              })
              .exec((error, result) => {
                console.log(error, result);
              });
          }
          await Driver.sendNativeQuery({connection: db, nativeQuery: sql});
        }
      }

    } catch (err) {
      // await Driver.destroyManager({manager: Manger});
      return res.badRequest({
        error: true,
        response_code: 1006,
        data: {
          message: err.message,
        },
      });
    }

    return res.ok({
      error: false,
      response_code: 1000,
      data: {
        message: 'Sync Database!',
      }
    });
  },

  checkSync: async function (req, res) {

    const Driver = sails.getDatastore('azureDriver').driver;
    const Manger = sails.getDatastore('azureDriver').manager;

    let db;
    try {
      db = (
        await Driver.getConnection({manager: Manger})
      ).connection;
    } catch (err) {
      // await Driver.destroyManager({manager: Manger});
      return res.badRequest({
        error: true,
        response_code: 1006,
        data: {
          message: err.message,
        },
      });
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Do some stuff here...
    // e.g.
    //     await Driver.sendNativeQuery({
    //       connection: db,
    //       nativeQuery: '...'
    //     });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // Finally, before we continue, tear down the dynamic connection manager.
    // (this also takes care of releasing the active connection we acquired above)
    // await Driver.destroyManager({manager: Manger});

    // await Driver.destroyManager({manager: Manger});
    return res.ok({
      error: false,
      response_code: 1000,
      data: {
        message: 'Status: Online!',
      },
    });
  },

  getIP: async function (req, res) {
    const os = require('os');
    const iFaces = os.networkInterfaces();
    const WiFiControl = require('wifi-control');
    const portScanner = require('portscanner');

    const azure_ip = '104.45.154.157';
    const target_ip = '192.168.137.1';
    const photon_ip = 5505;
    let server_ips = [];
    let wifi_interface = [];

    let isFoundWifi = false;
    let isFoundIP = false;
    let isFoundPhoton = false;

    await Object.keys(iFaces).forEach((ifname) => {
      let alias = 0;

      if (ifname === 'en0' || ifname === 'Ethernet') {
        iFaces[ifname].forEach((iFace) => {
          if (iFace.family === 'IPv4' && iFace.internal === false) {
            server_ips.push(iFace.address);
          }
          ++alias;
        });
      }
    });

    //  Check Wifi SSID:
    WiFiControl.init({
      debug: true
    });
    WiFiControl.scanForWiFi((err, response) => {
      if (err) console.log(err);
      wifi_interface = response.networks;
      wifi_interface.forEach(aps => {
        if (aps.ssid === 'MediVRx') {
          isFoundWifi = true;
          console.log('wifi: ', aps);
        }
      });
    });

    // Azure server ip assign
    // if (!server_ips.length) {
    //   server_ips.push(azure_ip);
    // }

    // Check the specific server ip
    server_ips.forEach(ip => {
      if (ip === target_ip) {
        isFoundIP = true;
        console.log('ip: ', ip);
      }
    });

    // check the photon port
    portScanner.checkPortStatus(photon_ip, target_ip, (err, status) => {
      if (err) console.log(err);
      if (status === 'open') {
        isFoundPhoton = true;
        console.log('port: ', status);
      }
    });

    if (isFoundIP && isFoundWifi && isFoundPhoton) {
      return res.ok({
        error: false,
        response_code: 1000,
        data: {
          ip: target_ip,
          active_ip: isFoundIP,
          wifi: wifi_interface,
          active_wifi: isFoundWifi,
          photon_port: photon_ip,
          active_photon: isFoundPhoton,
        },
      });
    } else {
      return res.ok({
        error: true,
        response_code: 1006,
        data: {
          ip: target_ip,
          active_ip: isFoundIP,
          wifi: wifi_interface,
          active_wifi: isFoundWifi,
          photon_port: photon_ip,
          active_photon: isFoundPhoton,
        },
      });
    }

  }
};

