define(['lodash','mongodb','async','bluebird'],
	function (_,mongodb,async,Promise) {
		var ObjectID = mongodb.ObjectID;
		return {
			__construct:function(options){
				this.connection = options.connection;
				this.options = options;
				this.collection = this.connection.collection(options.table);
			},
			insert:function(options){
				var _this = this;
				return new Promise(function(resolve,reject){
					var data = options.data;
					if(!data){
						return reject(new Error('You must specify conditions option to insert.'));
					}

					_this.collection.insert(data,function(error,result){
						if(error){
							return reject(error);
						}
						var resultData = result.ops;
						if(!_.isArray(data) && !error && resultData){
							resultData = resultData[0];
						}
						resolve({
							success:true,
							data:resultData,
							result:result
						});
					});
				});


			},
			update:function(options){
				var _this = this;
				return new Promise(function(resolve,reject){
					var conditions = options.conditions;
					var data = options.data;
					/*
					 opts:
					 w	            The write concern.
					 wtimeout       The write concern timeout.
					 j              Specify a journal write concern.
					 upsert
					 multi
					 */
					var opts = options.options || {};

					if(!data || !conditions){
						return reject(new Error('You must specify data and conditions options to update.'));
					}

					_this.collection.update(conditions,{$set:data},opts,function(error,result){
						if(error){
							return reject(error);
						}
						resolve({
							success:true,
							result:result
						});
					});

				});



			},
			filterOptions:function(options){
				return _.pick(options,['fields','sort','skip','limit','timeout']);
			},
			/**
			 * @param conditions
			 * @param options =>{
			 *      conditions:
			 *      join:
			 *      fields:
			 *      sort:
			 *      skip:0
			 *      limit:10
			 *      timeout:
			 * }
			 * @param callback
			 */
			find:function(options){
				var _this = this;
				//var args = Array.prototype.slice.call(arguments);
				//var callback = args.pop();
				//var options = args[0] || {};

				return new Promise(function(resolve,reject){
					var conditions = options.conditions || {};
					var join = options.join;
					//var join = options.join = {
					//	'models/comment':{
					//		conditions:{},
					//		sort:{},
					//		join:{
					//			user:{}
					//		}
					//	}
					//};
					_this.collection.find(conditions,_this.filterOptions(options)).toArray(function(error,data){
						if(error){
							return reject(error);
						}
						_this.join(join,data).then(function(data){
							resolve({
								success:true,
								data:data
							});
						}).catch(reject);

					});
					//_this.collection.find(conditions,{skip:2}).toArray(callback);
				});



			},
			findOne:function(options){
				var _this = this;


				return new Promise(function(resolve,reject){
					var conditions = options.conditions || {};
					var join = options.join;

					_this.collection.findOne(conditions,_this.filterOptions(options),function(error,data){
						if(error){
							return reject(error);
						}
						if(!data){
							return resolve({
								success:true,
								data:null
							});
						}
						_this.join(join,[data]).then(function(data){
							resolve({
								success:!error,
								data:data[0]
							});
						}).catch(reject);

					});
				});

			},
			join:function(join,data){


				var _this = this;
				return new Promise(function(resolve,reject){
					if(!join || !_this.options.model.relationships){
						return resolve(data);
					}
					var i = Object.keys(join).length;


					_.each(join,function(joinOptions,relationshipKey){
						var relationship = _this.options.model.relationships[relationshipKey];
						if(!relationship){
							//_this.app.error('The relationship '+relationshipKey+' does not exist');
							return reject('The relationship '+relationshipKey+' does not exist',data);
						}
						var model = _this.app.model.create(relationship.model);
						var opts = _.extend({},relationship.options,joinOptions);
						opts = _this.getInConditions(opts,relationship,data,model);
						//fixme: this should use Promise.all instead of this manual counter
						model.find(opts).then(function(joinData){

							_this.joinData(relationshipKey,relationship,data,joinData.data);
							i--;
							if(!i){
								resolve(data);
							}
						}).catch(reject);

						//var extend _this.model.relationships[relationshipKey]
					});
				});

			},
			joinData:function(relationshipKey,relationship,data,relatedData){

				var _this = this;
				var parents, children, path;
				if(relationship.type==='belongsTo') {
					parents = relatedData;
					children = data;
				}else {
					parents = data;
					children = relatedData;
				}
				var map = {};
				path = relationship.key.split('.');
				var key = path.pop();
				path = path.join('.');
				this.eachDeep(parents,path,function(item){
					map[item[key]] = item;
				});

				// example: classes.class_id -> the path will be classes and the foreign key class_id. We want
				// to loop the classes array and add the related class using the class_id
				path = relationship.foreignKey.split('.');
				var foreignKey = path.pop();
				path = path.join('.');
				this.eachDeep(children,path,function(item,rootItem){
					//the index is kinda useless when parent data is deep
					var parentItem = map[item[foreignKey]];
					if(relationship.type ==='hasMany'){
						parentItem[relationshipKey] = parentItem[relationshipKey] || [];
						parentItem[relationshipKey].push(rootItem);
					}else if(relationship.type ==='hasOne'){
						parentItem[relationshipKey] = rootItem;
					}else if(relationship.type ==='belongsTo'){
						item[relationshipKey] = parentItem;
						//parentItem[relationshipKey] = rootItem;
					}

				});



				return data;//not really needed to return this
			},
			getInConditions:function(options,relationship,data,model){

				var conditions = {};
				var ids = [];
				if(relationship.type ==='hasMany' || relationship.type === 'hasOne'){
					//var ids = _.pluck(data,relationship.key);
					//this is for deep parents
					this.eachDeep(data,relationship.key,function(id){
						ids.push(id);
					});

					//fixme: This part should be a seperate method called in the appropriate store of the related model since its diff depending on db type

					//this is for deep children: //db.users.find({classes:{$elemMatch: {class_id:ObjectId("53ec17cde7471ee08ab7c96d")}}})
					//todo: I made an assumption that this (nested $elemMatch) is correct: db.users.find({subitems:{$elemMatch:{classes:{$elemMatch: {class_id:ObjectId("53ec17cde7471ee08ab7c96d")}}}}})
					var splitKey = relationship.foreignKey.split('.');
					var conditionsPointer = conditions;
					for (var i = 0; i < splitKey.length; i++) {
						var key = splitKey[i],
							last = splitKey.length -1 === i;
						if(last){
							conditionsPointer[key] = {
								$in:ids
							};
						}else{
							var nextPointer = {};
							conditionsPointer[key] = {$elemMatch:nextPointer};
							conditionsPointer = nextPointer;
						}

					}
					//old code for non deep
//					conditions[relationship.foreignKey] = {
//						$in:ids
//					};
				}else if(relationship.type==='belongsTo'){

					//var ids = _.pluck(data,relationship.foreignKey);
					//this is for deep children, we need deep parents
					this.eachDeep(data,relationship.foreignKey,function(id){
						ids.push(id);
					});
					conditions[relationship.key] = {
						$in:ids
					};
				}

				options.conditions = _.extend(conditions,options.conditions);
				return options;
			},
			//todo: The remove and find signatures don't match. Find takes options and conditions as one. I might want to reconsider this
			remove:function(options){
				var _this = this;

				return new Promise(function(resolve,reject){
					var conditions = options.conditions;
					if(!conditions){
						return reject(new Error('You must specify conditions option to remove.'));
					}

					var relationships = [];
					var relationshipKeys = [];

					_.each(_this.options.model.relationships,function(relationship,key){
						if(relationship.cascadeDelete && ['hasMany','[hasOne'].indexOf(relationship.type) > -1){
							relationships.push(relationship);
							relationshipKeys.push(relationship.key);
						}
					});

					//todo: I could use the relationshipKeys and if they are already in conditions I don't need to do a findAndRemove


					_this.findAndRemove({
						conditions:conditions
					}).then(function(result){

						//fixme: change async map to use Promise.all
						async.map(relationships,function(relationship,done){
							var model = _this.app.model.create(relationship.model);
							var opts = _.extend({},relationship.options);
							opts = _this.getInConditions(opts,relationship,result.data,model);
							model.remove({
								conditions:opts.conditions
							}).then(function(result){
								done(null,result);
							}).catch(done);

						},function(error,results){
							if(error){
								return reject(error);
							}
							resolve({
								success:!error,
								result:result,
								relatedResults:results
							});
						});

					}).catch(reject);


					//_this.collection.remove(conditions,function(error,result){
					//	callback(error,{
					//		success:!error,
					//		result:result
					//	});
					//});

					//var args = Array.prototype.slice.call(arguments);
					//var callback = args.pop();
					//args.push(function(error,result){
					//	callback(error,{
					//		success:!error,
					//		result:result
					//	});
					//});
					//this.collection.remove.apply(this.collection,args);
				});

			},
			findAndRemove:function(options){
				var _this = this;

				return new Promise(function (resolve,reject) {
					var conditions = options.conditions;
					if(!conditions){
						return reject(new Error('You must specify conditions option to remove.'));
					}


					_this.collection.find(conditions).toArray(function(error,removedData){
						if(error){
							return reject(error);
						}
						//get in conditions
						_this.collection.deleteMany(conditions,function(error,result){
							resolve({
								success:!error,
								data:removedData,
								result:result
							});
						});
					});
				});

			},
			objectId:function(id){
				return id ? new ObjectID(id) : new ObjectID();
			}
		};

	});