'use strict';

var Promise = require('bluebird'),
	_ = require('lodash');

var connect = require('./connect'),
	eachDeep = require('../../eachDeep');

function filterOptions(options) {
	return _.pick(options, ['fields', 'sort', 'skip', 'limit', 'timeout']);
}
function filterConditions(conditions) {
	return _.pickBy(conditions, (value)=>{
		return typeof value !== 'undefined';
	});
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
				return collection.find(filterConditions(conditions), filterOptions(options)).toArrayAsync();
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
				return collection.find(filterConditions(conditions), filterOptions(options)).limit(1).nextAsync();
			})
			.then(data=> {
				return this.join(join, data);
			});
	}

	join(join, data) {
		if (!join || !this.model.relationships || !data || (_.isArray(data) && !data.length)) {
			return data;
		}

		return Promise
			.all(_.map(join, (joinOptions, relationshipKey)=> {
				var relationship = this.model.relationships[relationshipKey];
				if (!relationship) {
					throw new Error('The relationship ' + relationshipKey + ' does not exist');
				}
				var model = this.orm.load(relationship.model);
				var opts = _.extend({}, relationship.options, joinOptions);
				opts = this.getInConditions(opts, relationship, data, model);
				return model.find(opts).then((joinData)=> {
					return this.joinData(relationshipKey, relationship, data, joinData);
				});
			}))
			.return(data);
	}

	joinData(relationshipKey, relationship, data, relatedData) {
		var parents, children, path;
		if (relationship.type === 'belongsTo') {
			parents = relatedData;
			children = data;
		} else {
			parents = data;
			children = relatedData;
		}
		var map = {};
		path = relationship.key.split('.');
		var key = path.pop();
		path = path.join('.');
		eachDeep(parents, path, function (item) {
			map[item[key]] = item;
		});

		// example: classes.class_id -> the path will be classes and the foreign key class_id. We want
		// to loop the classes array and add the related class using the class_id
		path = relationship.foreignKey.split('.');
		var foreignKey = path.pop();
		path = path.join('.');
		eachDeep(children, path, function (item, rootItem) {
			//the index is kinda useless when parent data is deep
			var parentItem = map[item[foreignKey]];
			if (relationship.type === 'hasMany') {
				parentItem[relationshipKey] = parentItem[relationshipKey] || [];
				parentItem[relationshipKey].push(rootItem);
			} else if (relationship.type === 'hasOne') {
				parentItem[relationshipKey] = rootItem;
			} else if (relationship.type === 'belongsTo') {
				item[relationshipKey] = parentItem;
				//parentItem[relationshipKey] = rootItem;
			}

		});
		return data;//not really needed to return this
	}

	getInConditions(options, relationship, data) {
		var conditions = {};
		var ids = [];
		if (relationship.type === 'hasMany' || relationship.type === 'hasOne') {
			//var ids = _.pluck(data,relationship.key);
			//this is for deep parents
			eachDeep(data, relationship.key, function (id) {
				ids.push(id);
			});

			//fixme: This part should be a seperate method called in the appropriate store of the related model since its diff depending on db type

			//this is for deep children: //db.users.find({classes:{$elemMatch: {class_id:ObjectId("53ec17cde7471ee08ab7c96d")}}})
			//todo: I made an assumption that this (nested $elemMatch) is correct: db.users.find({subitems:{$elemMatch:{classes:{$elemMatch: {class_id:ObjectId("53ec17cde7471ee08ab7c96d")}}}}})
			var splitKey = relationship.foreignKey.split('.');
			var conditionsPointer = conditions;
			for (var i = 0; i < splitKey.length; i++) {
				var key = splitKey[i],
					last = splitKey.length - 1 === i;
				if (last) {
					conditionsPointer[key] = {
						$in: ids
					};
				} else {
					var nextPointer = {};
					conditionsPointer[key] = {$elemMatch: nextPointer};
					conditionsPointer = nextPointer;
				}

			}
		} else if (relationship.type === 'belongsTo') {

			eachDeep(data, relationship.foreignKey, function (id) {
				ids.push(id);
			});
			conditions[relationship.key] = {
				$in: ids
			};
		}

		options.conditions = _.extend(conditions, options.conditions);
		return options;
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
			})
			.then(res=>{
				let resultData = res.ops;
				if(!_.isArray(data) && res.ops){
					resultData = res.ops[0];
				}
				return _.assign({data: resultData}, res);
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

		if (!data || !conditions || !Object.keys(data).length) {
			throw new Error('You must specify data and conditions options to update.');
		}
		return this.getCollection()
			.then(collection=> {
				return collection.updateMany(filterConditions(conditions), {$set: data}, opts);
			});
	}

  findOneAndUpdate(options) {
		const conditions = options.conditions;
    const data = options.data;
		/*
		 opts:
		 writeConcern
		 upsert
		 */
    const opts = options.options || {};

		if (!data || !conditions || !Object.keys(data).length) {
			throw new Error('You must specify data and conditions options to update.');
		}
		return this.getCollection()
			.then(collection=> {
				return collection.findOneAndUpdate(filterConditions(conditions), {$set: data}, opts);
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

		_.each(this.model.relationships, (relationship)=> {
			if (relationship.cascadeDelete && ['hasMany', 'hasOne'].indexOf(relationship.type) > -1) {
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
			});

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
				return collection.find(filterConditions(conditions)).toArrayAsync();
			})
			.then(removedData=> {
				return collection.deleteMany(filterConditions(conditions))
					.then(result=> {
						return _.assign({}, result, {
							data: removedData
						});
					});
			});

	}
	static close(){
		return connect.closeConnections();
	}
}

module.exports = MongoStore;
