/*
* status terminal
* */


var red_img = 'images/red_light.png';
var green_img = 'images/green_light.png';

// server ip get
io.socket.get('/get-ip', function (resData, jwRes) {
  console.log(resData.data.ip);
  if (resData.response_code === 1000) {
    $('.address__ip').text(resData.data.ip);

    setTimeout(function () {
      $('#img__running').attr('src', red_img);
    }, 1500);
  }
});

// db connection check
io.socket.get('/teachers', function (resData, jwRes) {
  if (resData) {
    setTimeout(function () {
      $('#img__database').attr('src', red_img);
    }, 2500);
  } else {
    $('#img__database').attr('src', green_img);
  }
});

// sync check to remote db server
io.socket.get('/database/checkSync', function (resData, jwRes) {
  if (resData.response_code === 1000) {
    setTimeout(function () {
      $('#img__sync').attr('src', red_img);
    }, 2500);
  } else {
    $('#img__sync').attr('src', green_img);
  }
});


// subscribe to receive downloading status from server at runtime
io.socket.get('/modules/subscribe-download-status');

// Whenever a `modules` event is received, display downloading status text on electron console app
io.socket.on('modules', function (msg) {
  if (msg.status === 'downloading') {
    console.log('Got a downloading status with IP:', msg.ip);
  }
});


// terminal cmd
jQuery(function ($, undefined) {
  $('#terminal_wrapper').terminal(function (command, term) {
    var cmd = command.trim();

    if (cmd === 'reset') { // reset session
      io.socket.post('/database/reset', function (resData, jwRes) {
        if (resData.response_code === 1000) {
          term.echo('Reset session!');
        } else {
          term.echo('Reset failed!');
        }
        term.echo(JSON.stringify(resData));
      });

    } else if (cmd === 'new session') { // new session create
      io.socket.get('/teachers', function (resData, jwRes) {
        const leng = resData.length;
        const userInfo = {
          username: '*',
          email: 'teacher' + (leng + 1) + '@getmedi.com',
          password: 'medip@ss',
        };

        io.socket.post('/teacher/register', userInfo, function (resData, jwRes) {
          term.echo('Create new session!');
          term.echo(JSON.stringify(resData));
        });
      });

    } else if (cmd === 'sync') { // local db sync
      io.socket.get('/database/checkSync', function (resData, jwRes) {
        if (resData.response_code === 1000) {
          term.echo('Sync successfully!');
        } else {
          term.echo('Sync failed!');
        }
      })

    } else if (cmd === 'help') { // help command
      term.echo('Type `help` to see this list.\n\n' +
      'Use `reset` to clear local database.\n' +
      'Use `sync` to sync local data to remote db server.\n' +
      'Use `new session` to create session on local database.');
    } else {
      term.echo('Not command!');
    }

  }, {
    greetings: 'MediVRx Server',
    name: 'electron',
    height: 200,
    prompt: '[[;#D72424;]> '
  });
});

