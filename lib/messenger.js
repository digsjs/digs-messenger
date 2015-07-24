'use strict';

let Promise = require('bluebird');
let url = require('url');
let debug = require('debug')('digs:digs-messenger');
let DigsEmitter = require('digs-common/digs-emitter');
let DigsClient = require('./client');
const INTERNAL_BROKER_MODULE = 'digs-mqtt-broker';

const DEFAULTS = {
  type: INTERNAL_BROKER_MODULE,
  json: false,
  url: 'mqtt://localhost:1883'
};

class DigsMessenger extends DigsEmitter {
  constructor(digs, opts) {
    super();

    this._digs = digs;
    this._opts = _.defaults(opts, DEFAULTS);

  }

  start() {
    this._initInternalBroker()
      .bind(this)
      .then(function() {
        return this._initClient();
      })
      .then(function() {
        this.emit('ready');
      });
  }

  _initClient() {
    return Promise.bind(this)
      .then(function() {
        let client = this._client = new DigsClient({
          project: this.project,
          namespace: this.namespace,
          broker: this._opts.broker
        });
        return client.start();
      });
  }

  _initInternalBroker() {
    if (this._opts.type !== 'digs-mqtt-broker') {
      return Promise.resolve();
    }
    return Promise.bind(this)
      .then(function() {
        let opts = this._opts.broker;
        if (opts.type === INTERNAL_BROKER_MODULE) {
          debug(`Starting internal broker`);

          let urlObj = url.parse(opts.url);
          opts.mqtt = opts.mqtt || require('mqtt');

          this.use(require(INTERNAL_BROKER_MODULE), {
            host: urlObj.hostname,
            port: _.parseInt(urlObj.port)
          });

          return this._loadPlugins(INTERNAL_BROKER_MODULE);
        }
      });
  }

  publish() {
    if (!this._client) {
      throw new Error('Client not ready!');
    }
    return this._client.publish.apply(this._client, arguments);
  }

  subscribe() {
    if (!this._client) {
      throw new Error('Client not ready!');
    }
    return this._client.subscribe.apply(this._client, arguments);
  }

}

module.exports = DigsMessenger;
