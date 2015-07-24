
      describe('_initInternalBroker()', function () {

        let digsMqttBroker = require('digs-mqtt-broker');
        let instance = {};

        beforeEach(function () {
          sandbox.stub(d, 'use');
          sandbox.stub(d, 'loadPlugins')
            .returns(Promise.resolve([{ instance: instance }]));
        });

        it('should use the DigsMQTTBroker by default', function () {
          return expect(d._initInternalBroker()).to.eventually.eql([
            {
              instance: instance
            }
          ])
            .then(function () {
              expect(d.use).to.have.been.calledWith(digsMqttBroker, {
                host: 'localhost',
                port: 1883
              });
              expect(d._loadPlugins).to.have.been.calledWith('digs-mqtt-broker');
            });
        });
      });
