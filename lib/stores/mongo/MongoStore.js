'use strict';

var Promise = require('bluebird');

class MongoStore{
	constructor(){
		
	}
	find(){
		return Promise.resolve([
			{}
		]);
	}
	findOne(){
		return Promise.resolve({

		});
	}
	insert(){
		return Promise.resolve({

		});
	}
	update(){
		return Promise.resolve({

		});
	}
	remove(){
		return Promise.resolve({

		});
	}
	findAndRemove(){
		return Promise.resolve({

		});
	}
}

module.exports = MongoStore;
