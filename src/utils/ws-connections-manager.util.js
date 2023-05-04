const Queue = require('better-queue');
const winston = require('../config/logger');

const onNewConnection = (connectionsManagerInstance, ConnectionControllerClass) => async (ws, req) => {
  const connectionHandler = new ConnectionControllerClass(ws, req, connectionsManagerInstance);
  connectionHandler.close = function() {
    ws.close();
  };
  connectionHandler.send = function(msg) {
    let msgStr = msg;
    if (typeof msg === 'object') {
      msgStr = JSON.stringify(msg);
    }
    try {
      ws.send(msgStr);
      return true;
    } catch (e) {
      winston.warn(e);
      return false;
    }
  };
  connectionHandler.messagesQueue = new Queue(async function(input, cb) {
    await connectionHandler.onMessage(input);
    cb(null, null);
  });

  ws.on('message', async msg => {
    connectionHandler.messagesQueue.push(msg);
  });
  ws.on('error', err => {
    winston.warn(`connection ${connectionHandler.toString()} error: ${err}`);
  });
  ws.on('close', code => {
    const itemIndex = connectionsManagerInstance.connections.indexOf(connectionHandler);
    connectionsManagerInstance.connections.splice(itemIndex, 1);
  });
  connectionsManagerInstance.connections.push(connectionHandler);
};

class WebsocketConnectionsManager {
  constructor() {
    this.connections = [];
    this.sendTo = (filter, msg) => {
      let count = 0;
      this.connections.forEach(c => {
        if (filter(c)) {
          if (c.send(msg)) {
            count += 1;
          }
        }
      });
      return count;
    };

    this.find = filter => {
      const connections = [];
      this.connections.forEach(c => {
        if (filter(c)) {
          connections.push(c);
        }
      });
      return connections;
    };

    this.forEach = fn => this.connections.forEach(fn);

    this.findOne = filter => {
      // eslint-disable-next-line no-restricted-syntax
      for (const c of this.connections) {
        if (filter(c)) {
          return c;
        }
      }
      return null;
    };
  }
}

module.exports = {
  onNewConnection,
  WebsocketConnectionsManager,
};
