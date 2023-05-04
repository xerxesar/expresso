function ask(ws, msg) {
  let _msg = msg;
  if (typeof _msg === 'object') _msg = JSON.stringify(_msg);
  return new Promise(resolve => {
    // eslint-disable-next-line no-shadow
    ws.on('message', d => resolve(d));
    ws.send(_msg);
  });
}
function waitForMessage(ws) {
  return new Promise(resolve => {
    // eslint-disable-next-line no-shadow
    const handler = d => {
      resolve(d);
      ws.removeListener('message', handler);
    };
    ws.on('message', handler);
  });
}
function waitToOpen(ws) {
  return new Promise(resolve => {
    ws.on('open', _ => {
      resolve(true);
    });
  });
}
function waitToClose(ws) {
  return new Promise(resolve => {
    ws.on('close', _ => resolve(true));
  });
}
module.exports = {
  ask,
  waitToOpen,
  waitForMessage,
  waitToClose,
};
