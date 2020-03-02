"use strict";

const EventEmitter = require('events').EventEmitter;
const util = require('util');
const utils = require('../../util/utils');
const TcpSocket = require('./tcpsocket');

const ST_STARTED = 1;
const ST_CLOSED = 2;

// private protocol, no need exports
const HEAD_SIZE = 4;

/**
 * websocket protocol processor
 * @class
 * @memberof hybridConnector
 */
let Processor = function(closeMethod) {
  EventEmitter.call(this);
  this.closeMethod = closeMethod;
  this.state = ST_STARTED;
};
util.inherits(Processor, EventEmitter);

module.exports = Processor;

Processor.prototype.add = function(socket, data) {
  if(this.state !== ST_STARTED) {
    return;
  }
  let tcpsocket = new TcpSocket(socket, {headSize: HEAD_SIZE,
                                         headHandler: utils.headHandler,
                                         closeMethod: this.closeMethod});
  this.emit('connection', tcpsocket);
  socket.emit('data', data);
};

Processor.prototype.close = function() {
  if(this.state !== ST_STARTED) {
    return;
  }
  this.state = ST_CLOSED;
};