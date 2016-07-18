'use strict';

var assert = require('chai').assert,
	_ = require('lodash');

var ORM = require('../../../lib/ORM'),
	models = require('../../fixtures/models'),
	config = require('../../config'),
	ObjectId = require('mongodb').ObjectId,
	mongoRecords = require('../../fixtures/mongoRecords');

describe('mongo.store', function () {
	var orm;
	var modelClasses = _.assign({}, models, {
		// add custom models
	});
	beforeEach(function () {
		orm = new ORM({
			databases: config.databases,
			loader: key=> modelClasses[key]
		});
		return orm.utils.mongo.loadFixtures(config.databases.mongo.default.uri, mongoRecords);
	});

	after(function () {
		// no need to do after each since connections are shared between orm instances
		return orm.close();
	});

	describe('find', function () {
		it('should be able to find results', function () {
			var userModel = orm.load('user');
			return userModel
				.find({
					conditions: {
						role: 'user'
					}
				})
				.then(results=> {
					assert(results.length > 0);
				});
		});
	});

	describe('findOne', function () {
		it('should be able to find a result', function () {
			var userModel = orm.load('user');
			return userModel
				.findOne({
					conditions: {
						_id: new ObjectId('55300b3d133a91947cb81546')
					}
				})
				.then(result=> {
					assert.isObject(result);
				});
		});
	});

	describe('relationships', function () {
		describe('hasOne', function () {
			it('should return data with shallow to shallow relationship', function () {
				var model = orm.load('post');

				return model
					.find({
						join: {
							upload: {}
						}
					})
					.then(function (result) {
						assert.isTrue(result.length > 0, 'it should have at least one result');
						assert.isObject(result[0].upload, 'it should return the related model');

					});
			});
			it.skip('should return data with shallow to deep relationship', function () {
				assert(false, 'Not Implemented');
			});
			it.skip('should return data with deep to shallow relationship', function () {
				assert(false, 'Not Implemented');
			});
		});

		describe('belongsTo', function () {
			it('should return data with shallow to shallow relationship', function () {

				var model = orm.load('post');
				return model
					.find({
						join: {
							user: {}
						}
					})
					.then(function (result) {
						assert.isTrue(result.length > 0, 'it should have at least one result');
						assert.isObject(result[0].user, 'it returned the related model');
						assert.equal(result[0].user._id.toString(), result[0].user_id.toString(), 'the related model key matches');

					});

			});
			it('should return data with shallow to deep relationship', function () {
				var model = orm.load('product');
				return model
					.find({
						join: {
							subcategory: {}
						}
					})
					.then(function (result) {
						assert.isTrue(result.length > 0, 'it should have at least one result');
						assert.isObject(result[0].subcategory, 'it returned the related model');
						assert.equal(result[0].subcategory._id.toString(), result[0].subcategory_id.toString(), 'the related model key matches');

					});
			});
			it('should return data with deep to shallow relationship', function () {

				var model = orm.load('user');
				return model
					.find({
						join: {
							class: {}
						}
					})
					.then(function (result) {
						assert.isTrue(result.length > 0, 'it should have at least one result');
						assert.isObject(result[0].classes[0].class, 'it returned the related model');
						assert.equal(result[0].classes[0].class._id.toString(), result[0].classes[0].class_id.toString(), 'the related model key matches');

					});
			});

		});

		describe('hasMany', function () {
			it('should return data with shallow to shallow relationship', function () {
				var model = orm.load('user');
				return model
					.find({
						join: {
							posts: {}
						}
					})
					.then(function (result) {
						assert.isTrue(result.length > 0, 'it should have at least one result');
						assert.isArray(result[0].posts, 'it returned the related model');
						assert.equal(result[0].posts[0].user_id.toString(), result[0]._id.toString(), 'the related model key matches');

					});
			});
			it('should return data with shallow to deep relationship', function () {

				var model = orm.load('class');
				return model
					.find({
						join: {
							users: {}
						}
					})
					.then(function (result) {
						assert.isTrue(result.length > 0, 'it should have at least one result');
						assert.isArray(result[0].users, 'it returned the related model');
						assert(!!_.find(result[0].users[0].classes, function (_class) {
							return _class.class_id.toString() === result[0]._id.toString();
						}), 'the related model key matches');


					});
			});
			it('should return data with deep to shallow relationship', function () {
				var model = orm.load('category');
				return model
					.find({
						join: {
							products: {}
						}
					})
					.then(function (result) {
						assert.isTrue(result.length > 0, 'it should have at least one result');
						assert.isArray(result[0].subcategories[0].products, 'it returned the related model');
						assert(!!_.find(result[0].subcategories[0].products, function (item) {
							return item.subcategory_id.toString() === result[0].subcategories[0]._id.toString();
						}), 'the related model key matches');


					});
			});
		});
	});

	describe('insert', function () {
		it('should be able to insert a record', function () {
			var userModel = orm.load('user');
			return userModel
				.insert({
					data: {
						//_id: new ObjectId(),
						name: 'Jennifer',
						role: 'user',
						email: 'test@test.com'
					}
				})
				.then(result=> {
					assert(result.insertedId.toString());
				});
		});
	});

	describe('update', function () {
		it('should be able to update a record', function () {
			var userModel = orm.load('user');
			return userModel
				.update({
					conditions: {
						_id: new ObjectId('55300b3d133a91947cb81546')
					},
					data: {
						name: 'Chad'
					}
				})
				.then(result=> {
					assert(!result.errors);
					assert(result.modifiedCount > 0);
				});
		});
	});

	describe('upsert', function () {
		it('should be able to upsert a record', function () {
			var userModel = orm.load('user');
			return userModel
				.upsert({
					conditions: {
						_id: new ObjectId('55300b3d133a91947cb81546')
					},
					data: {
						name: 'Chad'
					}
				})
				.then(result=> {
					assert(result.modifiedCount > 0);
				});
		});
	});

	describe('remove', function () {
		it('should be able to remove a record', function () {
			var user_id = new ObjectId('55300b3d133a91947cb81546');
			var userModel = orm.load('user');
			var postModel = orm.load('post');

			function getData() {
				return Promise
					.all([
						userModel.find({
							conditions: {
								_id: user_id
							}
						}),
						postModel.find({
							conditions: {
								user_id: user_id
							}
						})

					])
					.then(results=> {
						return {
							users: results[0].length,
							posts: results[0].length
						};
					});
			}

			return getData()
				.then(results=> {
					assert(results.users > 0);
					assert(results.posts > 0);
				})
				.then(()=> {
					return userModel.remove({
						conditions: {
							_id: user_id
						}
					});
				})
				.then(result=> {
					assert(result.deletedCount > 0);
					assert(result.relatedResults[0].deletedCount > 0, 'it should delete related posts');
					assert(result.relatedResults[0].relatedResults[0].deletedCount > 0, 'it should delete related comments to deleted posts');
					assert(result.relatedResults[0].relatedResults[1].deletedCount > 0, 'it should delete related uploads to deleted posts');
					return getData();
				})
				.then(results=> {
					assert(results.users === 0);
					assert(results.posts === 0);
				});
		});
	});

	describe('validate', function () {
		it('should validate the data', function () {
			var userModel = orm.load('user');
			var data = {
				name: 'lexa',
				role: 'user',
				email: 'test@test.com',
				wrongField: 'this should be filtered out'
			};
			// userModel.schemaValidator.schema
			assert.isArray(userModel.schemaValidator.schema.properties.classes.schema.properties.rating.validation);
			var validated = userModel.validate({
				action: 'insert',
				data: data
			});
			assert.isObject(validated);
			assert(validated.valid);
			assert.deepEqual(_.omit(validated.data, '_id'), _.omit(data, 'wrongField', '_id'));
		});
	});

});
