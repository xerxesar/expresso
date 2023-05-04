const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const httpMocks = require('node-mocks-http');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const WebSocket = require('ws');
const app = require('../../src/app');
const config = require('../../src/config/config');
const auth = require('../../src/middlewares/auth');
const { tokenService, emailService } = require('../../src/services');
const AppError = require('../../src/utils/AppError');
const setupTestDB = require('../utils/setupTestDB');
const { User, Token, Fault } = require('../../src/models');
const { roleRights } = require('../../src/config/roles');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
const { waitToClose, waitForMessage, waitToOpen, ask } = require('../utils/asyncWebsocketPatterns');

setupTestDB();
app.listen(3000);

describe('User websocket', () => {
  describe('User', () => {
    let ws;
    beforeEach(async () => {
      await insertUsers([userOne]);
      ws = new WebSocket(
        `ws://localhost:3000/ws?access_token=${userOneAccessToken}`
      );
      await waitToOpen(ws);
    });
    afterEach(async () => {
      if (ws.readyState === 1) {
        ws.close();
        await waitToClose(ws);
      }
    });
    test('server should close unauthorized connections', async () => {
      const con = new WebSocket('ws://localhost:3000/ws');
      expect(await waitToClose(con)).toEqual(true);
    });

    test('send A (online)', async () => {
      const res = await ask(ws, 'A');
      expect(res).toEqual('A');
    });
  });
});
