'use strict';

var Promise = require('bluebird'),
	mongodb = Promise.promisifyAll(require('mongodb')),
	_ = require('lodash');

var MongoClient = Promise.promisifyAll(mongodb.MongoClient);


var connections = {};

module.exports = {
	getConnection(connectionString){
		if(!connections[connectionString]){
			connections[connectionString] = MongoClient.connectAsync(connectionString)
				.then(db=>{
					Promise.promisifyAll(db.listCollections);
					connections[connectionString] = db;
					return db;
				});
		}
		return Promise.resolve(connections[connectionString]);
	},
	closeConnections(){
		return Promise.all(_.map(connections, (db)=>{
			db.close();
		}));
	}
};