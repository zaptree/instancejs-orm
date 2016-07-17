'use strict';

module.exports = {
	category: {
		table:'categories',
		schema:{
		},
		relationships:{
			products:{
				type:'hasMany',
				model:'product',
				foreignKey:'subcategory_id',
				key:'subcategories._id',
				cascadeDelete:true
			}
		}
	},
	class: {
		table:'classes',
		schema:{

		},
		relationships:{
			//db.users.find({classes:{$elemMatch: {class_id:ObjectId("53ec17cde7471ee08ab7c96d")}}})
			users:{
				type:'hasMany',
				model:'user',
				foreignKey:'classes.class_id',
				key:'_id',
				cascadeDelete:true//todo: not sure if this is even possible
			}
		}
	},
	comment: {
		table:'comments',
		schema:{
		},
		relationships:{
			post:{
				type:'belongsTo',
				model:'post',
				foreignKey:'post_id',
				key:'_id'
			}
		}

	},
	post: {
		table:'posts',
		schema:{
		},
		relationships:{
			user:{
				type:'belongsTo',
				model:'user',
				foreignKey:'user_id',
				key:'_id'
			},
			comments:{
				type:'hasMany',
				cascadeDelete:true,
				model:'comment',
				foreignKey:'post_id',
				key:'_id'
			},
			upload:{
				type:'hasOne',
				model:'upload',
				cascadeDelete:true,
				foreignKey:'post_id',
				key:'_id'
			}
		}
	},
	product: {
		table:'products',
		schema:{
		},
		relationships:{
			subcategory:{
				type:'belongsTo',
				model:'category',
				foreignKey:'subcategory_id',
				key:'subcategories._id'
			}
		}
	},
	upload: {
		table:'uploads',
		schema:{

		},
		relationships:{
			post:{
				type:'belongsTo',
				model:'post',
				foreignKey:'post_id',
				key:'_id'
			}
		}
	},	
	user: {
		table:'users',
		schema:{

		},

		relationships: {
			posts: {
				type: 'hasMany',
				model: 'post',
				foreignKey: 'user_id',
				key: '_id',
				cascadeDelete: true,
				//these are just default conditions that can be overriden
				conditions: {
					active: true
				},
				sort: {
					'created': 'desc'
				}
			},
			class: {
				type: 'belongsTo',
				model: 'class',
				foreignKey: 'classes.class_id',
				key: '_id'
			}
		}
	},

	posts: {
		table:'posts',
		strictSchema:true,
		schema:{
			_id:{
				type:'ObjectId'
			},
			title:{
				type:'string',
				validation:'required'
			},
			user_id:{
				type:'ObjectId',
				validation:'required'
			}


		},
		relationships:{
			user:{
				type:'belongsTo',
				model:'user',
				foreignKey:'user_id',
				key:'_id'
			},
			comments:{
				type:'hasMany',
				cascadeDelete:true,
				model:'comment',
				foreignKey:'post_id',
				key:'_id'
			},
			upload:{
				type:'hasOne',
				model:'upload',
				cascadeDelete:true,
				foreignKey:'post_id',
				key:'_id'
			}
		}
	}
};