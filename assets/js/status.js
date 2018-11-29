/*
* status terminal
* */


let red_img = 'images/red_light.png';
let green_img = 'images/green_light.png';
let status_term;

// server ip get
io.socket.get('/get-ip', (resData, jwRes) => {
  console.log(resData);
  setTimeout(() => {
    if (resData.response_code === 1000) {
      $('.address__ip').text(resData.data.ip);

      $('#img__running').attr('src', red_img);
      status_term.echo(`✓ Connected to server ${resData.data.ip}\n` +
      `Wifi SSID: 'MediVRx'`);
    } else {
      if (!resData.data.active_ip) {
        status_term.echo('Not found Server IP!');
      }
      if (!resData.data.active_wifi) {
        status_term.echo('Not found Wifi SSID!');
      }
      if (!resData.data.active_photon) {
        status_term.echo('Not found Photon Port!');
      }

      setInterval(() => {
        status_term.echo('Checking the server ip, wifi ssid and photon port now...');
        checkServerStatus();
      }, 10000);
    }
  }, 1500);
});

function checkServerStatus() {
  io.socket.get('/get-ip', (resData, jwRes) => {
    if (!resData.data.active_ip) {
      status_term.echo('Not found Server IP!');
    } else {
      status_term.echo(`✓ Found the specific server ip '${resData.data.ip}'`);
    }

    if (!resData.data.active_wifi) {
      status_term.echo('Not found Wifi SSID!');
    } else {
      status_term.echo(`✓ Found the specific wifi ssid 'MediVRx'`);
    }

    if (!resData.data.active_photon) {
      status_term.echo('Not found Photon Port!');
    } else {
      status_term.echo(`✓ Found the specific photon port '${resData.data.photon_port}'`);
    }
  });
}

// db connection check
io.socket.get('/teachers', (resData, jwRes) => {
  if (resData) {
    setTimeout(() => {
      $('#img__database').attr('src', red_img);
      status_term.echo('✓ Connected to local storage.');
    }, 2500);
  } else {
    $('#img__database').attr('src', green_img);
    status_term.echo('Failed to connect local storage!');
  }
});

// sync check to remote db server
io.socket.get('/database/checkSync', (resData, jwRes) => {
  setTimeout(() => {
    if (resData.response_code === 1000) {
        $('#img__sync').attr('src', red_img);
        status_term.echo('✓ Connected to remote database server. Syncing now...')
    } else {
        $('#img__sync').attr('src', green_img);
        status_term.echo('Failed to connect remote database server!');
    }
  }, 3500);
});

// subscribe to receive downloading status from server at runtime
io.socket.get('/modules/subscribe-download-status');

// Whenever a `modules` event is received, display downloading status text on electron console app
io.socket.on('modules', (msg) => {
  if (msg.status === 'downloading') {
    status_term.echo(`Downloading '${msg.filename}' from IP ${msg.ip} ...`);
  }
});


// terminal cmd
jQuery(($, undefined) => {
  status_term = $('#terminal_wrapper').terminal((command, term) => {
    let cmd = command.trim();

    if (cmd === 'reset') { // reset session
      io.socket.post('/database/reset', (resData, jwRes) => {
        if (resData.response_code === 1000) {
          term.echo('Reset session!');
        } else {
          term.echo('Reset failed!');
        }
        term.echo(JSON.stringify(resData));
      });

    } else if (cmd === 'new session') { // new session create
      io.socket.get('/teachers', (resData, jwRes) => {
        const leng = resData.length;
        const userInfo = {
          username: '*',
          email: 'teacher' + (leng + 1) + '@getmedi.com',
          password: 'medip@ss',
        };

        io.socket.post('/teacher/register', userInfo, (resData, jwRes) => {
          term.echo('Create new session!');
          term.echo(JSON.stringify(resData));
        });
      });

    } else if (cmd === 'sync') { // local db sync
      io.socket.get('/database/checkSync', (resData, jwRes) => {
        if (resData.response_code === 1000) {
          term.echo('Sync successfully!');
        } else {
          setTimeout(() => {
            term.echo('Sync failed!');
          }, 1500);
        }
      });

    } else if (cmd === 'ipcheck') { // server ip check
      io.socket.get('/get-ip', (resData, jwRes) => {
        if (resData.response_code === 1000) {
          term.echo(JSON.stringify(resData.data));
        } else {
          term.echo('Not Found Active Servers!\n' +
          JSON.stringify(resData.data));
        }
      });

    } else if (cmd === 'help') { // help command
      term.echo('Type `help` to see this list.\n\n' +
      'Use `reset` to clear local database.\n' +
      'Use `sync` to sync local data to remote db server.\n' +
      'Use `new session` to create session on local database.\n' +
      'Use `ipcheck` to check server IPs list.');
    } else {
      term.echo('No command!');
    }

  }, {
    greetings: '',
    name: 'electron',
    height: 200,
    prompt: '[[;#D72424;]> '
  });
});

