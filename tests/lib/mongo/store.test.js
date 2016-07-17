'use strict';

var assert = require('chai').assert,
	_ = require('lodash');

var	ORM = require('../../../lib/ORM'),
	models = require('../../fixtures/models'),
	config = require('../../config'),
	ObjectId = require('mongodb').ObjectId,
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
		return orm.utils.mongo.loadFixtures(config.databases.mongo.default.uri, mongoRecords);
	});
	describe('find', function(){
		it('should be able to find results', function(){
			var userModel = orm.load('users');
			return userModel
				.find({
					conditions: {
						role: 'user'
					}
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
					conditions: {
						_id: new ObjectId('55300b3d133a91947cb8154a')
					}
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
						//_id: new ObjectId(),
						name: 'Jennifer'
					}
				})
				.then(result=>{
					assert(result.insertedId.toString());
				});
		});
	});

	describe('update', function(){
		it('should be able to update a record', function(){
			var userModel = orm.load('users');
			return userModel
				.update({
					conditions: {
						_id: new ObjectId('55300b3d133a91947cb8154a')
					},
					data: {
						name: 'Chad'
					}
				})
				.then(result=>{
					assert(result.modifiedCount > 0);
				});
		});
	});

	describe('upsert', function(){
		it('should be able to upsert a record', function(){
			var userModel = orm.load('users');
			return userModel
				.upsert({
					conditions: {
						_id: new ObjectId('55300b3d133a91947cb8154a')
					},
					data: {
						name: 'Chad'
					}
				})
				.then(result=>{
					assert(result.modifiedCount > 0);
				});
		});
	});

	describe('remove', function(){
		it('should be able to remove a record', function(){
			var userModel = orm.load('users');
			return userModel
				.remove({
					conditions: {
						_id: new ObjectId('55300b3d133a91947cb8154a')
					}
				})
				.then(result=>{
					assert(result.deletedCount > 0);
				});
		});
	});

	describe('validate', function(){
		it('should validate the data', function(){
			var userModel = orm.load('users');
			var validated = userModel.validate({
				action: 'insert',
				data: {
					name: 'lexa',
					wrongField: 'this should be filtered out'
				}
			});
			assert.isObject(validated);
		});
	});

});
