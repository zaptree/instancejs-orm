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
				return this.parse(results, options);
			});
	}),

	findOne: decorate('onFindOne', function (options) {
		return this.store.findOne(options)
			.then((result)=> {
				return this.parse(result, options);
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

	upsert: decorate('onUpsert', function (options) {
		var validatedOptions = this.validate(_.assign({
			action: 'update'
		}, options));
		if (!validatedOptions.valid) {
			return Promise.resolve(validatedOptions);
		}
		return this.store.upsert(validatedOptions);
	}),

	remove: decorate('onRemove', function (options) {
		return this.store.remove(options);
	}),

	validate: function (options) {
		let data = options.data;

		// do validation using schema-validator
		var validated = this.schemaValidator.validate(data, {
			action: options.action,
			skipRequired: options.action === 'update'
		});
		return _.assign({}, options, {
			valid: validated.success,
			data: validated.data,
			errors: validated.errors
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

	onUpsert: function () {
		return this.onSave.apply(this, arguments);
	},

	onRemove: decorator,

	parse: function (data, options) {
		if(!data){
			return data;
		}else if (_.isArray(data)) {
			_.each(data, (record, i)=> {
				data[i] = this.parseOne(record, options);
			});
			return data;
		} else {
			return this.parseOne(data, options);
		}
	},

	parseOne: function (item) {
		return item;
	}
};
