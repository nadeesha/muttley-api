var mongoose = require('mongoose'),	
env = process.env.NODE_ENV || 'development',
    config = require('../config')[env],
	Schema = mongoose.Schema;

var ClassroomSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	url: {
		type: String,
		required: true
	}
});

mongoose.model('Classroom', ClassroomSchema);
