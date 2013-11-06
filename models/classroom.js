var mongoose = require('mongoose'),	
	Schema = mongoose.Schema
	//crypto = require('crypto'),	
	//utility = require('../utility')


	/** 
 * schema.
 =================================================*/

var ClassroomSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	url: {
		type: String,
		required: false
	}
});



/** 
 * model.
 =================================================*/

mongoose.model('Classroom', ClassroomSchema);
