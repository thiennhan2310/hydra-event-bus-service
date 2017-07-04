/**
 * @name Hydra-event-bus
 * @summary Hydra-event-bus Hydra service entry point
 * @description Provides the Event Bus for Hydra microservices
 */
'use strict';

const version = require('./package.json').version;
const hydra = require('hydra');
const hydraExpress = require('hydra-express');
let config = require('fwsp-config');
const util = require('./src/util');
const HydraLogger = require('fwsp-logger').HydraLogger;

let hydraLogger = new HydraLogger();
hydra.use(hydraLogger);

/* Constants */
const ebPreKey = 'hydra:event-bus';
/**
 * Load configuration file
 */
config
  .init('./config/config.json')
  .then(() => {
    config.version = version;
    config.hydra.serviceVersion = version;
    /**
     * Initialize hydra
     */
    return hydraExpress.init(config.getObject(), version, () => {
      hydraExpress.registerRoutes({
        '/v1/hydra-event-bus': require('./routes/hydra-event-v1-routes')
      });
    })
  })
  .then(serviceInfo => {
    let logEntry = `Starting ${config.hydra.serviceName} (v.${config.version})`;
    hydra.sendToHealthLog('info', logEntry);
    util.openListener();
  })
  .catch((err) => {
    hydra.sendToHealthLog('error', err);
  });
