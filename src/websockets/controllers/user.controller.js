// const { toJSON } = require('../../utils/toJSON.util');
// const { AutoFlag } = require('../../utils/AutoFlag.util');

class User {
  constructor(ws, req, connectionsManager) {
    this.ws = ws;
    this.connectionsManager = connectionsManager;
    this.req = req;
    // const query = req.query;
    // const filter = { id: 1 };
    // if (query.owner) {
    //   Object.assign(filter, { owner: req.query.owner });
    // }
    this.send('test');
  }

  // eslint-disable-next-line class-methods-use-this
  async onMessage(msg) {}
}

module.exports = User;
