'use strict';

const _ = require('lodash');

const model = require('./model'),
	stores = {
		mongo: require('./stores/mongo/MongoStore')
	},
	MongoUtils = require('./stores/mongo/MongoUtils');

class ORM {
	constructor(options) {
		this.models = {};
		if(options.loader){
			this.loader = options.loader;
		}
		this.utils = {
			mongo: new MongoUtils({
				orm: this
			})
		};
		this.options = options;
	}
	create(klass){
		let instance;
		if(_.isFunction(klass)){
			instance = new klass();
		}else{
			instance = _.assign({}, klass);
		}
		_.each(model, function(val, key){
			if(!instance[key]){
				instance[key] = val;
			}
		});

		var db = instance.db.split('.');
		var dbType = db[0];
		instance.store = new stores[dbType]({
			orm: this,
			model: instance,
			table: instance.table,
			connection: _.get(this.options.databases, db)
		});

		return instance;
	}
	loader(key){
		// todo: I should probably load file with require using Path.join(this.options.root || process.cwd(), key)
		throw new Error('No loader specified');
	}
	load(key, klass) {
		if (klass) {
			this.models[key] = this.create(klass);

		} else {
			this.models[key] = this.create(this.loader(key));
		}

		return this.models[key];

	}
}

module.exports = ORM;
