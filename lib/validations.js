'use strict';

var _ = require('lodash'),
	ObjectId = require('mongodb').ObjectId;

// additional types and rules for the schema-validator
module.exports = {
	lexicon: {
		'VALIDATION_ERROR_NOT_OBJECT_ID': 'Value should be an mongo ObjectId'
	},
	types: {
		'ObjectID': 'ObjectId',
		'objectId': 'ObjectId',
		'ObjectId': {
			cast: function (value) {
				if(_.isString(value)){
					return new ObjectId(value);
				}
				return value;
			},
			validate: function (value) {
				var result = {
					success: true,
					value: value
				};
				if (!_.isObject(value)) {
					result.success = false;
					result.error = 'VALIDATION_ERROR_NOT_OBJECT_ID';
				}
				return result;
			}
		},
	},
	rules: {

	}
};
