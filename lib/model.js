'use strict';

var _ = require('lodash'),
	Promise = require('bluebird');

function decorator(method, args) {
	/*jshint validthis: true */
	return method.apply(this, args);
}

function decorate(_decorator, method) {
	return function () {
		return this[_decorator](method, arguments);
	};

}

module.exports = {
	db: 'mongo.default',
	table: null,
	autoLock: true,

	find: decorate('onFind', function (options) {
		return this.store.find(options)
			.then(results => {
				return this.parse(results, true);
			});
	}),

	findOne: decorate('onFindOne', function (options) {
		return this.store.findOne(options)
			.then((result)=> {
				return this.parse(result);
			});
	}),

	insert: decorate('onInsert', function (options) {
		var validatedOptions = this.validate(_.assign({
			action: 'insert'
		}, options));
		if (!validatedOptions.valid) {
			return Promise.resolve(validatedOptions);
		}
		return this.store.insert(validatedOptions);
	}),

	update: decorate('onUpdate', function (options) {
		var validatedOptions = this.validate(_.assign({
			action: 'update'
		}, options));
		if (!validatedOptions.valid) {
			return Promise.resolve(validatedOptions);
		}
		return this.store.update(validatedOptions);
	}),

	remove: decorate('onRemove', function (options) {
		return this.store.remove(options);
	}),

	findAndRemove: decorate('onRemove', function (options) {
		return this.store.findAndRemove(options);
	}),

	validate: function (options) {
		let valid = true,
			data = options.data;

		// do validation using schema-validator

		return _.assign({}, options, {
			valid: valid,
			data: data
		});
	},


	onFind: decorator,

	onFindOne: function () {
		return this.onFind.apply(this, arguments);
	},

	onSave: decorator,

	onInsert: function () {
		return this.onSave.apply(this, arguments);
	},

	onUpdate: function () {
		return this.onSave.apply(this, arguments);
	},

	onRemove: decorator,

	parse: function (data, multi) {
		if (multi) {
			_.each(data, (record, i)=> {
				data[i] = this.parseOne(record);
			});
			return data;
		} else {
			return this.parseOne(data);
		}
	},

	parseOne: function (item) {
		return item;
	}
};
