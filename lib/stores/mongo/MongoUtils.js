'use strict';

var Promise = require('bluebird'),
	_ = require('lodash'),
	ObjectId = require('mongodb').ObjectId;

var connect = require('./connect');


class MongoUtils {
	constructor(options) {
		this.options = options;
		this.orm = options.orm;
	}

	loadFixtures(connectionString, fixtures) {
		return this.removeAll(connectionString)
			.then(()=>{
				return this.insertData(connectionString, fixtures);
			})
			.then(results=>{
				return results;
			});
	}

	removeAll(connectionString) {
		var db;
		return connect.getConnection(connectionString)
			.then((_db)=>{
				db = _db;
			})
			.then(()=>{
				return db.listCollections().toArray();
			})
			.map((collection)=>{
				if (!collection.name.match(/^system\./)) {
					return db.collection(collection.name).deleteManyAsync();
				}
			});
	}

	insertData(connectionString, fixtures) {
		var db;
		return connect.getConnection(connectionString)
			.then((_db)=>{
				db = _db;
			})
			.then(()=>{
				return Promise.all(_.map(fixtures, (data, key)=>{

					let collection = db.collection(key);
					return collection.insertMany(_.map(data, (doc)=>{
						if (doc._id && _.isString(doc._id)) {
							doc = _.assign({}, doc, {
								_id: ObjectId(doc._id)
							});
						}
						return doc;
					}));
				}));
			});
	}

}

module.exports = MongoUtils;
