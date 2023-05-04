const { WebsocketConnectionsManager } = require('../../utils/ws-connections-manager.util');

const wsUserConnectionsController = new WebsocketConnectionsManager();
module.exports = wsUserConnectionsController;
