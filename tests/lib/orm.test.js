'use strict';

var assert = require('chai').assert,
	_ = require('lodash');

var	ORM = require('../../lib/ORM'),
	models = require('../fixtures/models'),
	config = require('../config');

describe('ORM', function(){
	var orm;
	var modelClasses = _.assign({}, models, {
		// add custom models
	});
	beforeEach(function(){
		orm = new ORM({
			databases: config.databases,
			// TODO: I can solve circular dependencies by just setting the dependency to null for the second caller, at least it will load the files
			// TODO: BETTER IDEA, I can just load the dependent models in the constructor of the models as dependencies and also have them as properties
			// TODO: btw how does di handle circular dependencies? I don't think my solution on the top will work,
			// TODO: I will just have to load all models in bootstarp (which I need to implement)
			// for the microservices I will want in the factory to check it it exists (orm.get('user')) and if it does just return that
			// the loader should allow async loading`
			loader: key=> modelClasses[key]
		});
	});

	after(function(){
		// no need to do after each since connections are shared between orm instances
		return orm.close();
	});

	it('should create an instance of a model', function(){
		assert.isObject(orm.utils.mongo);

		// loading model using the custom loader
		var userModel = orm.load('user');
		// loading model by manually passing in the model
		var commentModel = orm.load('comments', {
			db: 'mongo.default',
			table:'comments',
			schema: {},
			relationships: {}
		});

		assert.equal(userModel.table, 'users');
		assert.equal(commentModel.table, 'comments');
		assert.isFunction(userModel.find);
		assert.isFunction(commentModel.find);
		assert.isObject(userModel.store);
		assert.isObject(commentModel.store);


	});


});
