const axios = require('axios');
const qs = require('qs');

const conf = require('./conf.js');

let data;

/**
 * port:  port server
 * host: host server
 * username: username for authentication
 * password: username's password for authentication
 * events: this parameter determines whether events are emited.
 **/
var ami = new require('asterisk-manager')(conf.port, conf.host, conf.username, conf.password, conf.true);

// In case of any connectiviy problems we got you coverd.
ami.keepConnected();

// Listen for any/all AMI events.
ami.on('managerevent', function (evt) {
  //console.log('MANAGER EVENT ::', evt)
});

// Listen for specific AMI events. A list of event names can be found at
// https://wiki.asterisk.org/wiki/display/AST/Asterisk+11+AMI+Events
//ami.on('hangup', function(evt) {});
//ami.on('confbridgejoin', function(evt) {});
ami.on('hangup', function (evt) {
  console.log('HANGUP ::', evt);
  console.log(evt.channel);
  data = evt.channel;
  axios.post('http://192.168.217.128/post.php', qs.stringify({
    'order_number': data
  }))
    .then((res) => {
      console.log(res)
      console.log(`statusCode: ${res.data}`)
    })
    .catch((error) => {
      console.error(error)
    })
});

ami.on('dtmfbegin', function (evt) {
  console.log('DTMF ::', evt);
});

// Listen for Action responses.
//ami.on('response', function(evt) {});

// Perform an AMI Action. A list of actions can be found at
// https://wiki.asterisk.org/wiki/display/AST/Asterisk+11+AMI+Actions
ami.action({
  'action': 'originate',
  'channel': 'SIP/100',
  'context': 'abc',
  'exten': 101,
  'priority': 1,
  'variable': {
    'name1': 'auto call being made',
    'name2': 'helllog'
  }
}, function (err, res) { });

console.log('program ends here');
