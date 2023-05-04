const WebSocket = require('ws');
const chalk = require('chalk');
const commandLineArgs = require('command-line-args');
const sampleData = require('./sample-elevator-datas.json');

const ws = new WebSocket('ws://localhost:3000/ws');

// command-line arguments
const optionDefinitions = [
  { name: 'keep-alive', alias: 'A', type: Boolean },
  { name: 'send-data-timeout', alias: 'd', type: Number, defaultValue: -1 },
];

const cliOptions = commandLineArgs(optionDefinitions);

// fetch one elevator data sample randomly
function nextRandomElevatorData(type = 'simple') {
  const r = Math.floor(Math.random() * sampleData[type].length);
  return sampleData[type][r];
}

// send data to server
function send(data) {
  // eslint-disable-next-line no-console
  console.log(`${chalk.yellow('sending')}: ${JSON.stringify(data)}`);
  // check if data is object
  if (typeof data === 'object') {
    ws.send(JSON.stringify(data));
  } else {
    ws.send(data);
  }
}

// handle websocket connection onOpne
ws.on('open', function open() {
});

ws.on('message', function incoming(data) {
  // eslint-disable-next-line no-console
  console.log(`${chalk.green('received')}: ${data}`);

  // parse the msg as JSON
  const msg = JSON.parse(data);

  // respond elevator count if OP === 'E'
  if (msg.d) {
    return send({ success: true });
  }
  //  if (msg.T && msg.T === 'D' && msg.D && msg.D.OP && msg.D.OP === 'E') {
  //  }
});
