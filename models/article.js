var mongoose = require('mongoose'),
	//config = require('../config/config')[env],
	Schema = mongoose.Schema
	//utility = require('../utility')


	/** 
 * schema.
 =================================================*/

var ArticleSchema = new Schema({
	
	title: {
		type: String,
		required: true
	},
	summary: {
		type: String,
		required: false
	},
	url: {
		type: String,
		required: true
	}
});

mongoose.model('Article', ArticleSchema);