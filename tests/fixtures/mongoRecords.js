'use strict';

var ObjectId = require('mongodb').ObjectId;

module.exports = {
	'categories': [
		{
			_id:new ObjectId('55300b3d133a91947cb8154a'),
			title:'books',
			subcategories:[
				{
					_id:new ObjectId('552f2abb08b215a87b67ed14'),
					title:'drama'
				},
				{
					_id:new ObjectId('552f2abf08b215a87b67ed15'),
					title:'mystery'
				},
				{
					_id:new ObjectId('552f2ac308b215a87b67ed16'),
					title:'fiction'
				}
			]
		},
		{
			_id:new ObjectId('55300b3d133a91947cb8154b'),
			title:'videogames',
			subcategories:[
				{
					_id:new ObjectId('552f2ac708b215a87b67ed17'),
					title:'ps4'
				},
				{
					_id:new ObjectId('552f2acb08b215a87b67ed18'),
					title:'xbox'
				},
				{
					_id:new ObjectId('552f2acf08b215a87b67ed19'),
					title:'sega'
				},
				{
					_id:new ObjectId('552f2ad508b215a87b67ed1a'),
					title:'wii'
				}
			]
		},
		{
			_id:new ObjectId('55300b3d133a91947cb8154c'),
			title:'clothes',
			subcategories:[
				{
					_id:new ObjectId('552f2ad908b215a87b67ed1b'),
					title:'pants'
				},
				{
					_id:new ObjectId('552f2ae808b215a87b67ed1c'),
					title:'shirts'
				}
			]
		}
	],
	'products': [
		{
			title:'The life of someone',
			subcategory_id:new ObjectId('552f2abb08b215a87b67ed14')
		},
		{
			title:'The hardships of life',
			subcategory_id:new ObjectId('552f2abb08b215a87b67ed14')
		},
		{
			title:'Detective Nick',
			subcategory_id:new ObjectId('552f2abf08b215a87b67ed15')
		},
		{
			title:'Lord of the bracelets',
			subcategory_id:new ObjectId('552f2ac308b215a87b67ed16')
		},
		{
			title:'The fictional story',
			subcategory_id:new ObjectId('552f2ac308b215a87b67ed16')
		},
		{
			title:'The last of us',
			subcategory_id:new ObjectId('552f2ac708b215a87b67ed17')
		},
		{
			title:'Infamous',
			subcategory_id:new ObjectId('552f2ac708b215a87b67ed17')
		},
		{
			title:'Rome',
			subcategory_id:new ObjectId('552f2acb08b215a87b67ed18')
		},
		{
			title:'sega game',
			subcategory_id:new ObjectId('552f2acf08b215a87b67ed19')
		},
		{
			title:'sega rally',
			subcategory_id:new ObjectId('552f2acf08b215a87b67ed19')
		},
		{
			title:'sonic',
			subcategory_id:new ObjectId('552f2acf08b215a87b67ed19')
		},
		{
			title:'wii sports',
			subcategory_id:new ObjectId('552f2ad508b215a87b67ed1a')
		},
		{
			title:'wii tennis',
			subcategory_id:new ObjectId('552f2ad508b215a87b67ed1a')
		},
		{
			title:'levis pants',
			subcategory_id:new ObjectId('552f2ad908b215a87b67ed1b')
		},
		{
			title:'CK shirt',
			subcategory_id:new ObjectId('552f2ae808b215a87b67ed1c')
		},
		{
			title:'Cheap Shirt',
			subcategory_id:new ObjectId('552f2ae808b215a87b67ed1c')
		}
	],
	'classes': [
		{
			_id:new ObjectId('55300b3d133a91947cb8153e'),//0
			title: 'biology'
		},
		{
			_id:new ObjectId('55300b3d133a91947cb8153f'),//1
			title: 'math'
		},
		{
			_id:new ObjectId('55300b3d133a91947cb81540'),//2
			title: 'physics'
		},
		{
			_id:new ObjectId('55300b3d133a91947cb81541'),//3
			title: 'english'
		},
		{
			_id:new ObjectId('55300b3d133a91947cb81542'),//4
			title: 'chemistry'
		},
		{
			_id:new ObjectId('55300b3d133a91947cb81543'),//5
			title: 'programming'
		},
		{
			_id:new ObjectId('55300b3d133a91947cb81544'),//6
			title: 'literature'
		},
		{
			_id:new ObjectId('55300b3d133a91947cb81545'),//7
			title: 'music'
		}
	],
	'users': [
		{
			_id:new ObjectId('55300b3d133a91947cb81546'),
			name: 'peter',
			email: 'peter@example.com',
			role: 'admin',
			classes: [
				{
					completed: true,
					class_id: new ObjectId('55300b3d133a91947cb8153e')
				},
				{
					completed: false,
					class_id: new ObjectId('55300b3d133a91947cb8153f')
				},
				{
					completed: false,
					class_id: new ObjectId('55300b3d133a91947cb81542')
				},
				{
					completed: false,
					class_id: new ObjectId('55300b3d133a91947cb81541')
				}
			]
		},
		{
			_id:new ObjectId('55300b3d133a91947cb81547'),
			name: 'john',
			email: 'john@example.com',
			role: 'superadmin',
			classes: [
				{
					completed: true,
					class_id: new ObjectId('55300b3d133a91947cb81540')
				},
				{
					completed: false,
					class_id: new ObjectId('55300b3d133a91947cb81541')
				},
				{
					completed: false,
					class_id: new ObjectId('55300b3d133a91947cb81544')
				}
			]


		},
		{
			_id:new ObjectId('55300b3d133a91947cb81548'),
			name: 'nick',
			email: 'nick@example.com',
			role: 'user',
			classes: [
				{
					completed: true,
					class_id: new ObjectId('55300b3d133a91947cb81542')
				},
				{
					completed: false,
					class_id: new ObjectId('55300b3d133a91947cb81543')
				},
				{
					completed: false,
					class_id: new ObjectId('55300b3d133a91947cb8153f')
				}
			]
		},
		{
			_id:new ObjectId('55300b3d133a91947cb81549'),
			name: 'maria',
			email: 'maria@example.com',
			role: 'user',
			classes: [
				{
					completed: true,
					class_id: new ObjectId('55300b3d133a91947cb81544')
				},
				{
					completed: false,
					class_id: new ObjectId('55300b3d133a91947cb81545')
				},
				{
					completed: false,
					class_id: new ObjectId('55300b3d133a91947cb81540')
				}
			]
		}
	],
	posts: [
		{
			_id:new ObjectId('55300b3d133a91947cb8154d'),
			user_id: new ObjectId('55300b3d133a91947cb81547'),
			title: 'Post from john 1'
		},
		//-------------
		{
			_id:new ObjectId('55300b3d133a91947cb8154e'),
			user_id: new ObjectId('55300b3d133a91947cb81546'),
			title: 'Post from peter 1'
		},
		{
			_id:new ObjectId('55300b3d133a91947cb8154f'),
			user_id: new ObjectId('55300b3d133a91947cb81546'),
			title: 'Post from peter 2'
		},
		{
			_id:new ObjectId('55300b3d133a91947cb81550'),
			user_id: new ObjectId('55300b3d133a91947cb81546'),
			title: 'Post from peter 3'
		},
		//-------------
		{
			_id:new ObjectId('55300b3d133a91947cb81551'),
			user_id: new ObjectId('55300b3d133a91947cb81548'),
			title: 'Post from nick 1'
		},
		{
			_id:new ObjectId('55300b3d133a91947cb81552'),
			user_id: new ObjectId('55300b3d133a91947cb81548'),
			title: 'Post from nick 2'
		},
		//-------------
		{
			_id:new ObjectId('55300b3d133a91947cb81553'),
			user_id: new ObjectId('55300b3d133a91947cb81549'),
			title: 'Post from maria 1'
		},
		{
			_id:new ObjectId('55300b3d133a91947cb81554'),
			user_id: new ObjectId('55300b3d133a91947cb81549'),
			title: 'Post from maria 2'
		},
		{
			_id:new ObjectId('55300b3d133a91947cb81555'),
			user_id: new ObjectId('55300b3d133a91947cb81549'),
			title: 'Post from maria 3'
		},
		{
			_id:new ObjectId('55300b3d133a91947cb81556'),
			user_id: new ObjectId('55300b3d133a91947cb81549'),
			title: 'Post from maria 4'
		},
		//-------------

	],
	comments: [
		{
			post_id: new ObjectId('55300b3d133a91947cb8154e'),
			user_id: new ObjectId('55300b3d133a91947cb81546'),
			title: 'Commment 1 Title for post 55300b3d133a91947cb81547'
		},
		//----------
		{
			post_id: new ObjectId('55300b3d133a91947cb81547'),
			user_id: new ObjectId('55300b3d133a91947cb81546'),
			title: 'Commment 1 Title for post 55300b3d133a91947cb81547'
		},
		{
			post_id: new ObjectId('55300b3d133a91947cb81547'),
			user_id: new ObjectId('55300b3d133a91947cb81547'),
			title: 'Commment 2 Title for post 55300b3d133a91947cb81547'
		},
		//----------
		{
			post_id: new ObjectId('55300b3d133a91947cb81546'),
			user_id: new ObjectId('55300b3d133a91947cb81548'),
			title: 'Commment 1 Title for post 55300b3d133a91947cb81546'
		},
		{
			post_id: new ObjectId('55300b3d133a91947cb81546'),
			user_id: new ObjectId('55300b3d133a91947cb81546'),
			title: 'Commment 2 Title for post 55300b3d133a91947cb81546'
		},
		//----------
		{
			post_id: new ObjectId('55300b3d133a91947cb81546'),
			user_id: new ObjectId('55300b3d133a91947cb81547'),
			title: 'Commment 1 Title for post 55300b3d133a91947cb81546'
		},
		{
			post_id: new ObjectId('55300b3d133a91947cb81546'),
			user_id: new ObjectId('55300b3d133a91947cb81549'),
			title: 'Commment 2 Title for post 55300b3d133a91947cb81546'
		},
		//----------
		{
			post_id: new ObjectId('55300b3d133a91947cb81546'),
			user_id: new ObjectId('55300b3d133a91947cb81546'),
			title: 'Commment 1 Title for post 55300b3d133a91947cb81546'
		},
		{
			post_id: new ObjectId('55300b3d133a91947cb81546'),
			user_id: new ObjectId('55300b3d133a91947cb81549'),
			title: 'Commment 2 Title for post 55300b3d133a91947cb81546'
		},
		//----------
		{
			post_id: new ObjectId('55300b3d133a91947cb81548'),
			user_id: new ObjectId('55300b3d133a91947cb81546'),
			title: 'Commment 1 Title for post 55300b3d133a91947cb81548'
		},
		{
			post_id: new ObjectId('55300b3d133a91947cb81548'),
			user_id: new ObjectId('55300b3d133a91947cb81547'),
			title: 'Commment 2 Title for post 55300b3d133a91947cb81548'
		},
		//----------
		{
			post_id: new ObjectId('55300b3d133a91947cb81548'),
			user_id: new ObjectId('55300b3d133a91947cb81546'),
			title: 'Commment 1 Title for post 55300b3d133a91947cb81548'
		},
		{
			post_id: new ObjectId('55300b3d133a91947cb81548'),
			user_id: new ObjectId('55300b3d133a91947cb81548'),
			title: 'Commment 2 Title for post 55300b3d133a91947cb81548'
		},
		//----------
		{
			post_id: new ObjectId('55300b3d133a91947cb81549'),
			user_id: new ObjectId('55300b3d133a91947cb81547'),
			title: 'Commment 1 Title for post 55300b3d133a91947cb81549'
		},
		{
			post_id: new ObjectId('55300b3d133a91947cb81549'),
			user_id: new ObjectId('55300b3d133a91947cb81549'),
			title: 'Commment 2 Title for post 55300b3d133a91947cb81549'
		},
		//----------
		{
			post_id: new ObjectId('55300b3d133a91947cb81549'),
			user_id: new ObjectId('55300b3d133a91947cb81547'),
			title: 'Commment 1 Title for post 55300b3d133a91947cb81549'
		},
		{
			post_id: new ObjectId('55300b3d133a91947cb81549'),
			user_id: new ObjectId('55300b3d133a91947cb81546'),
			title: 'Commment 2 Title for post 55300b3d133a91947cb81549'
		},
		//----------
		{
			post_id: new ObjectId('55300b3d133a91947cb81549'),
			user_id: new ObjectId('55300b3d133a91947cb81549'),
			title: 'Commment 1 Title for post 55300b3d133a91947cb81549'
		},
		{
			post_id: new ObjectId('55300b3d133a91947cb81549'),
			user_id: new ObjectId('55300b3d133a91947cb81548'),
			title: 'Commment 2 Title for post 55300b3d133a91947cb81549'
		},
		//----------
		{
			post_id: new ObjectId('55300b3d133a91947cb81549'),
			user_id: new ObjectId('55300b3d133a91947cb81546'),
			title: 'Commment 1 Title for post 55300b3d133a91947cb81549'
		},
		{
			post_id: new ObjectId('55300b3d133a91947cb81549'),
			user_id: new ObjectId('55300b3d133a91947cb81547'),
			title: 'Commment 2 Title for post 55300b3d133a91947cb81549'
		}
		//----------
	],
	uploads: [
		{
			post_id: new ObjectId('55300b3d133a91947cb8154d'),
			name: 'somefile.txt'
		},
		//-------
		{
			post_id: new ObjectId('55300b3d133a91947cb8154e'),
			name: 'somefile.txt'
		},
		//-------
		{
			post_id: new ObjectId('55300b3d133a91947cb8154f'),
			name: 'somefile.txt'
		},
		//-------
		{
			post_id: new ObjectId('55300b3d133a91947cb81550'),
			name: 'somefile.txt'
		},
		//-------
		{
			post_id: new ObjectId('55300b3d133a91947cb81551'),
			name: 'somefile.txt'
		},
		//-------
		{
			post_id: new ObjectId('55300b3d133a91947cb81552'),
			name: 'somefile.txt'
		},
		//-------
		{
			post_id: new ObjectId('55300b3d133a91947cb81553'),
			name: 'somefile.txt'
		},
		//-------
		{
			post_id: new ObjectId('55300b3d133a91947cb81554'),
			name: 'somefile.txt'
		},
		//-------
		{
			post_id: new ObjectId('55300b3d133a91947cb81555'),
			name: 'somefile.txt'
		},
		//-------
		{
			post_id: new ObjectId('55300b3d133a91947cb81556'),
			name: 'somefile.txt'
		}
	]
};
