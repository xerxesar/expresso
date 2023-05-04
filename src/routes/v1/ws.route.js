const express = require('express');
const { wsUserConnectionsManager } = require('../../websockets/connection-managers');
const { onNewConnection } = require('../../utils/ws-connections-manager.util');
const { userController } = require('../../websockets/controllers');

const wsAuth = require('../../middlewares/wsAuth');

const router = express.Router();

router.ws('/', wsAuth('CreateWSConnection'), onNewConnection(wsUserConnectionsManager, userController));

module.exports = router;
