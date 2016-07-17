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
	create(Klass){
		let instance;
		if(_.isFunction(Klass)){
			instance = new Klass();
		}else{
			instance = _.assign({}, Klass);
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
			connection: _.get(this.options.databases, instance.db)
		});

		return instance;
	}
	loader(key){
		// todo: I should probably load file with require using Path.join(this.options.root || process.cwd(), key)
		throw new Error('No loader specified to get ' + key);
	}
	load(key, klass) {
		if (klass) {
			this.models[key] = this.create(klass);

		} else if(!this.models[key]){
			let loadedKlass = this.loader(key);
			if(!loadedKlass){
				throw new Error('Could not load model with key ' + key);
			}
			this.models[key] = this.create(loadedKlass);
		}

		return this.models[key];

	}
	close(){
		return Promise.all(_.map(stores, (store)=>{
			return store.close();
		}));
	}
}

module.exports = ORM;
