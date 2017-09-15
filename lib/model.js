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

  findOneAndUpdate: decorate('onFindOneAndUpdate', function (options) {
    var validatedOptions = this.validate(_.assign({
      action: 'update'
    }, options));
    if (!validatedOptions.valid) {
      return Promise.resolve(validatedOptions);
    }
    return this.store.findOneAndUpdate(validatedOptions);
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

    let valid = true;
    let errors;
    let validatedData;

    if(_.isArray(data)){
      let valid = true;
      errors = [];
      validatedData = [];
      data.forEach(item=>{
        const validated = this.schemaValidator.validate(item, {
          action: options.action,
          skipRequired: options.action === 'update'
        });
        if(!validated.success){
          valid = false;
        }
        validatedData.push(validated.data);
        errors.push(validated.errors);
      });
      data = validatedData;

    }else{
      // do validation using schema-validator
      var validated = this.schemaValidator.validate(data, {
        action: options.action,
        skipRequired: options.action === 'update'
      });
      valid = validated.success;
      data = validated.data;
      errors = validated.errors;

    }
    return _.assign({}, options, {
      valid,
      data,
      errors,
    });
  },


  onFind: decorator,

  onFindOne: function (...args) {
    return this.onFind.apply(this, args);
  },

  onSave: decorator,

  onInsert: function (...args) {
    return this.onSave.apply(this, args);
  },

  onUpdate: function (...args) {
    return this.onSave.apply(this, args);
  },

  onFindOneAndUpdate: function (...args) {
    return this.onSave.apply(this, args);
  },

  onUpsert: function (...args) {
    return this.onSave.apply(this, args);
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
