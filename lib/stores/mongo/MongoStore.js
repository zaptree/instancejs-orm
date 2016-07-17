'use strict';

var Promise = require('bluebird'),
	mongodb = require('mongodb'),
	_ = require('lodash');

var connect = require('./connect');

var ObjectId = mongodb.ObjectId;

function filterOptions(options) {
	return _.pick(options, ['fields', 'sort', 'skip', 'limit', 'timeout']);
}

class MongoStore {
	constructor(options) {
		this.orm = options.orm;
		this.model = options.model;
		this.table = options.table;
		this.connection = options.connection;
	}

	getCollection() {
		return connect.getConnection(this.connection.uri)
			.then(db=> {
				return db.collection(this.table);
			});
	}

	/**
	 * @param conditions
	 * @param options =>{
	 *      conditions:
	 *      join:
	 *      fields:
	 *      sort:
	 *      skip:0
	 *      limit:10
	 *      timeout:
	 * }
	 * @param callback
	 */
	find(options) {
		var conditions = options.conditions || {};
		var join = options.join;

		return this.getCollection()
			.then(collection=> {
				return collection.find(conditions, filterOptions(options)).toArrayAsync();
				;
			})
			.then(data=> {
				return this.join(join, data);
			});
	}

	findOne(options) {
		var conditions = options.conditions || {};
		var join = options.join;

		return this.getCollection()
			.then(collection=> {
				return collection.find(conditions, filterOptions(options)).limit(1).nextAsync();
				;
			})
			.then(data=> {
				return this.join(join, data);
			});
	}

	join(join, data) {
		return Promise.resolve(data);
	}

	joinData(relationshipKey, relationship, data, relatedData) {

	}

	getInConditions(options, relationship, data, model) {
		return {};
	}

	insert(options) {
		var data = options.data;
		if (!data) {
			throw new Error('No data to insert');
		}
		return this.getCollection()
			.then(collection=> {
				if (_.isArray(data)) {
					return collection.insertManyAsync(data);
				}
				return collection.insertOne(data);
			});

	}

	update(options) {
		var conditions = options.conditions;
		var data = options.data;
		/*
		 opts:
		 writeConcern
		 upsert
		 */
		var opts = options.options || {};

		if (!data || !conditions) {
			throw new Error('You must specify data and conditions options to update.');
		}
		return this.getCollection()
			.then(collection=> {
				return collection.updateMany(conditions, {$set: data}, opts);
			});
	}

	upsert(options) {
		return this.update(_.assign({upsert: true}, options));
	}

	remove(options) {
		var conditions = options.conditions;
		if (!conditions) {
			throw new Error('You must specify conditions option to remove.');
		}

		var relationships = [];
		var relationshipKeys = [];

		_.each(this.model.relationships, (relationship, key)=> {
			if (relationship.cascadeDelete && ['hasMany', '[hasOne'].indexOf(relationship.type) > -1) {
				relationships.push(relationship);
				relationshipKeys.push(relationship.key);
			}
		});

		//todo: I could use the relationshipKeys and if they are already in conditions I don't need to do a findAndRemove

		return this
			.findAndRemove({
				conditions: conditions
			})
			.then(result=> {

				return Promise.resolve(relationships)
					.map(relationship=> {
						var model = this.orm.load(relationship.model);
						var opts = _.extend({}, relationship.options);
						opts = this.getInConditions(opts, relationship, result.data, model);

						return model.remove({
							conditions: opts.conditions
						});

					})
					.then(results=> {
						return _.assign({}, result, {
							relatedResults: results
						});
					});
			})

	}

	findAndRemove(options) {
		var collection;
		var conditions = options.conditions;
		if (!conditions) {
			throw new Error('You must specify conditions option to remove.');
		}
		return this.getCollection()
			.then(_collection=> {
				collection = _collection;
				return collection.find(conditions).toArrayAsync();
			})
			.then(removedData=> {
				return collection.deleteMany(conditions)
					.then(result=> {
						return _.assign({}, result, {
							data: removedData
						});
					});
			});

	}
}

module.exports = MongoStore;
