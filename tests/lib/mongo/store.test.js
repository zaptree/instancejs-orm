'use strict';

var assert = require('chai').assert,
	_ = require('lodash');

var	ORM = require('../../../lib/ORM'),
	models = require('../../fixtures/models'),
	config = require('../../config'),
	mongoRecords = require('../../fixtures/mongoRecords');

describe('mongo.store', function(){
	var orm;
	var modelClasses = _.assign({}, models, {
		// add custom models
	});
	beforeEach(function(){
		orm = new ORM({
			databases: config.databases,
			loader: key=> modelClasses[key]
		});
		return orm.utils.mongo.loadFixtures(config.databases.mongodb.default.uri, mongoRecords);
	});
	describe('find', function(){
		it('should be able to find results', function(){
			var userModel = orm.load('users');
			return userModel
				.find({

				})
				.then(results=>{
					assert(results.length > 0);
				});
		});
	});

	describe('findOne', function(){
		it('should be able to find a result', function(){
			var userModel = orm.load('users');
			return userModel
				.findOne({

				})
				.then(result=>{
					assert.isObject(result);
				});
		});
	});

	describe('insert', function(){
		it('should be able to insert a record', function(){
			var userModel = orm.load('users');
			return userModel
				.insert({
					data: {
						name: 'Jennifer'
					}
				})
				.then(result=>{
					assert.isObject(result);
				});
		});
	});

	describe('update', function(){
		it('should be able to update a record', function(){
			var userModel = orm.load('users');
			return userModel
				.update({
					conditions: {
						name: 'Nick'
					},
					data: {
						name: 'Chad'
					}
				})
				.then(result=>{
					assert.isObject(result);
				});
		});
	});

	describe('remove', function(){
		it('should be able to remove a record', function(){
			var userModel = orm.load('users');
			return userModel
				.remove({
					conditions: {
						name: 'Nick'
					}
				})
				.then(result=>{
					assert.isObject(result);
				});
		});
	});

	describe('findAndRemove', function(){
		it('should be able to findAndRemove a record', function(){
			var userModel = orm.load('users');
			return userModel
				.findAndRemove({
					conditions: {
						name: 'Nick'
					}
				})
				.then(result=>{
					assert.isObject(result);
				});
		});
	});

});
