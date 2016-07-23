'use strict';

var _ = require('lodash');

function eachDeep(objArray, path, callback, rootItem) {
	if(!objArray){
		return;
	}
	path = (_.isString(path) && path ? path.split('.') : path) || [];
	var key,
		isArray = _.isArray(objArray);

	if (!isArray) {
		rootItem = rootItem || objArray;//not sure if I want to do this or set rootItem to first array items (comment this out if that is the case)
		var clonedPath = path.slice(0);

		while (clonedPath.length && !isArray && objArray) {
			key = clonedPath.splice(0, 1);
			objArray = objArray[key];
			isArray = _.isArray(objArray);
		}
		if (isArray) {
			eachDeep(objArray, clonedPath, callback, rootItem);
		} else if (typeof objArray !== 'undefined') {
			callback(objArray, rootItem);
		}
	} else {
		_.each(objArray, function (item) {
			var iRootItem = rootItem || item; //need to make new var since all items in loop would of used the same item
			//this if statement is not needed but it should make it a little more efficient for when you are
			// actually trying to get the values of an array and not of a sub property of array.
			if (!path.length) {
				callback(item, iRootItem);
			} else {
				eachDeep(item, path, callback, rootItem, iRootItem);
			}
		});
	}

}

module.exports = eachDeep;