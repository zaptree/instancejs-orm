'use strict';

class MongoUtils{
	constructor(options){
		this.options = options;
		this.orm = options.orm;
	}
}

module.exports = MongoUtils;
