'use strict';

var Promise = require('bluebird'),
	mongodb = require('mongodb');

var mongo = Promise.promisifyAll(mongodb);

module.exports = mongo;