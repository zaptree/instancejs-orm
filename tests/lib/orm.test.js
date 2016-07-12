'use strict';

var assert = require('chai').assert,
	ORM = require('../../lib/ORM');

describe('ORM', function(){

	beforeEach(function(){

	});

	it('should test something', function(){
		var modelClasses = {};
		// https://babeljs.io/docs/plugins/transform-class-properties/
		modelClasses.User = {
			db: 'mongodb.default',
			table:'users',
			schema: {

			},
			relationships: {}
		};
		var orm = new ORM({
			databases: {
				mongodb: {
					default: {
						uri: 'mongodb://localhost/instancejs_orm_test'
					}
				}
			},
			// for the microservices I will want in the factory to check it it exists (orm.get('User')) and if it does just return that
			loader: function(key){
				// this could use require and key be a path or whatever method wanted to load models based on passed in key
				return modelClasses[key];
			}
		});
		// loading model using the custom loader
		var userModel = orm.load('User');
		// loading model by manually passing in the model
		var commentsModel = orm.load('Comments', {
			db: 'mongodb.default',
			table:'users',
			schema: {},
			relationships: {}
		});
		return userModel.find()
			.then(function(results){

			});
		assert.isObject(orm);
	});

});
