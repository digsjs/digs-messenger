'use strict';

let Messenger = require('./messenger');
let pkg = require('../package.json');

function digsMessenger(digs, opts) {
  opts = opts || {};

  let messenger = new Messenger(digs, opts);
  return messenger.start()
    .then(function(messenger) {
      digs.expose('publish', messenger.publish, messenger);
      digs.expose('subscribe', messenger.subscribe, messenger);
      return messenger;
    });
}

digsMessenger.metadata = {
  name: pkg.name,
  dependencies: [],
  defaults: {},
  version: pkg.version
};

digsMessenger.Messenger = Messenger;

module.exports = digsMessenger;
