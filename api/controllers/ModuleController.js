/**
 * ModuleController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const fs = require('fs');

module.exports = {

  friendlyName: 'Module Controller',

  description: 'This is a Module relative REST API controller.',

  getQuizData: async function (req, res) {

    // ---------------------------------------------------------------------------------------------- TEST CASE
    const initQuiz = [
      {
        'id': 1,
        'text': 'Which guidelines or recommendations do you refer to for managing hyperlipidemia in patients post-ACS?',
        'answers': [
          {
            'text': 'American College of Cardiology/American Heart Association (ACC/AHA) guidelines'
          },
          {
            'text': 'National Lipid Association (NLA) recommendations'
          },
          {
            'text': 'European (ESC/EAS) guidelines'
          },
          {
            'text': 'American Association of Clinical Endocrinologists/American College of Endocrinology (AACE/ACE)'
          },
          {
            'text': 'None of the above'
          }
        ],
        'correct_answer': '0'
      },
      {
        'id': 2,
        'text': 'What are your cholesterol goals in a patient who already has an LDL-C <70 mg/dL at the time of ACS?',
        'answers': [
          {
            'text': 'Decrease LDL-C as low as you can go with combination therapy'
          },
          {
            'text': 'No additional therapy needed'
          },
          {
            'text': 'Ensure that the patient is on a high intensity statin even if already <70mg/dL LDL-C'
          },
          {
            'text': 'Ensure that the patient is on a statin'
          },
          {
            'text': 'None of the above'
          }
        ],
        'correct_answer': '0'
      },
      {
        'id': 3,
        'text': 'How do you manage the cholesterol in your ACS patients who are not able to reach their LDL-C goal while taking the maximum tolerated statin?',
        'answers': [
          {
            'text': 'Ensure patient has been re-challenged with a high-intensity statin and isn’t able to tolerate a higher statin dose than the maximum tolerated statin'
          },
          {
            'text': 'No change in therapy'
          },
          {
            'text': 'Add ezetimibe'
          },
          {
            'text': 'Add a PCSK9 inhibitor'
          },
          {
            'text': 'None of the above'
          }
        ],
        'correct_answer': '0'
      }
    ];
    const isExistModule1 = await Modules.count({
      module_name: 'module1',
    });
    if (isExistModule1) {
      await Modules.destroy({module_name: 'module1'});
    }
    await Modules.create({
      module_name: 'module1',
      quiz_data: JSON.stringify(initQuiz),
      package: JSON.stringify({link: '/packages/module1.1'}),
    });
    // ----------------------------------------------------------------------------------------------

    if (!req.param('module_name')) {
      return res.badRequest({
        error: true, response_code: 1005, data: {
          message: 'Module name is required.'
        }
      });
    }

    const module = await Modules.findOne({
      module_name: req.param('module_name')
    });

    return res.ok({
      error: false, response_code: 1000, data: {
        questions: JSON.parse(module.quiz_data),
        package: JSON.parse(module.package),
      }
    });
  },

  downloadModule: function (req, res) {
    const filename = req.query.name;
    let file = require('path').resolve(sails.config.appPath + '/assets/modules/' + filename);

    if (fs.existsSync(file)) {
      res.setHeader('Content-disposition', 'attachment; filename=' + filename);

      let filestream = fs.createReadStream(file);
      filestream.pipe(res);

      const ip = req.ip;
      Modules.publish([{id: 'subscribe-download-status'}], {
        status: 'downloading',
        ip: ip,
        filename: filename,
      }, req);

    } else {
      return res.badRequest({
        error: true, response_code: 1005, data: {
          message: 'Module file is not exist.'
        }
      });
    }
  },

  subscribeDownloadStatus: function (req, res) {
    Modules.subscribe(req, [{id: 'subscribe-download-status'}]);

    return res.ok({
      error: false, response_code: 1000, data: {
        message: 'Subscribed successfully!'
      }
    });
  }
};
