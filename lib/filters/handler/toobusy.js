"use strict";

/**
 * Filter for toobusy.
 * if the process is toobusy, just skip the new request
 */
const conLogger = require('@sex-pomelo/sex-pomelo-logger').getLogger('con-log', __filename);
let toobusy = null;
const DEFAULT_MAXLAG = 70;


module.exports = function(maxLag) {
  return new FilterHandlerTooBusy(maxLag || DEFAULT_MAXLAG);
};

/**
 * @class
 * @implements {Filter}
 */
let FilterHandlerTooBusy = function(maxLag) {
  try {
    toobusy = require('toobusy');
  } catch(e) {
  }
  if(!!toobusy) {
    toobusy.maxLag(maxLag);
  }
};

FilterHandlerTooBusy.prototype.before = function(msg, session, next) {
  if (!!toobusy && toobusy()) {
    conLogger.warn('[toobusy] reject request msg: ' + msg);
    let err = new Error('Server toobusy!');
    err.code = 500;
    next(err);
  } else {
    next();
  }
};