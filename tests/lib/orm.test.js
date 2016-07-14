'use strict';

var assert = require('chai').assert,
	ORM = require('../../lib/ORM');

describe('ORM', function(){
	var databases = {
		mongodb: {
			default: {
				uri: 'mongodb://localhost/instancejs_orm_test'
			}
		}
	};
	var modelClasses = {};
	// https://babeljs.io/docs/plugins/transform-class-properties/
	modelClasses.User = {
		db: 'mongo.default',
		table:'users',
		schema: {

		},
		relationships: {}
	};
	beforeEach(function(){

	});

	it.only('should create an instance of a model', function(){
		throw new Error('circular dependencies, how do I solve them?')
		var orm = new ORM({
			databases: databases,
			// TODO: BETTER IDEA, I can just load the dependent models in the constructor of the models as dependencies and also have them as properties
			// TODO: btw how does di handle circular dependencies? I don't think my solution on the top will work,
			// TODO: I will just have to load all models in bootstarp (which I need to implement)
			// for the microservices I will want in the factory to check it it exists (orm.get('User')) and if it does just return that
			// the loader should allow async loading`
			loader: function(key){
				// this could use require and key be a path or whatever method wanted to load models based on passed in key
				return this.create(modelClasses[key]);
			}
		});
		assert.isObject(orm.utils.mongo);

		// loading model using the custom loader
		var userModel = orm.load('User');
		// loading model by manually passing in the model
		var commentModel = orm.load('Comments', {
			db: 'mongo.default',
			table:'users',
			schema: {},
			relationships: {}
		});

		assert.isFunction(userModel.find);
		assert.isFunction(commentModel.find);
		assert.isObject(userModel.store);
		assert.isObject(commentModel.store);



	});


});
