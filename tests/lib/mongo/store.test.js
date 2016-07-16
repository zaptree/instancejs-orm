'use strict';

var assert = require('chai').assert,
	ORM = require('../../../lib/ORM'),
	config = require('../../config'),
	mongoRecords = require('../../fixtures/mongoRecords');

describe('ORM', function(){
	var orm;
	var modelClasses = {
		User: {
			db: 'mongo.default',
			table:'users',
			schema: {

			},
			relationships: {}
		}
	};
	beforeEach(function(){
		orm = new ORM({
			databases: config.databases,
			loader: key=> this.create(modelClasses[key])
		});
		return orm.utils.mongo.loadFixtures(config.databases.mongodb.default.uri, mongoRecords);
	});
	describe('find', function(){
		it.only('should be able to find results', function(){
			assert(true);
		});
	});



});
