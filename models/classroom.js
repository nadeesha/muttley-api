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
		required: true
	}
});







var UserSchema = new Schema({
	email: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
		unique: true
	},
	_hashedPassword: {
		type: String,
		required: true
	},
	salt: {
		type: String,
		required: true
	},
	activationToken: {
		type: String,
		required: true
	},
	active: {
		type: Boolean,
		required: true
	},
	createdOn: {
		type: Date,
		required: true
	},
	lastUpdatedOn: {
		type: Date
	},
	authToken: {
		type: String
	},
	authTokenExpiredOn: {
		type: Date,
		default: Date.now
	},


	/** 
	 * master info.
	 =================================================*/
	firstName: {
		type: String
	},
	lastName: {
		type: String
	},
	dateOfBirth: {
		type: Date
	},
	gender: {
		type: Boolean
	},
	location: {
		type: String
	},
	contactNumbers: [String],
	nationalIdentifier: {
		type: String
	},
	isLookingOut: {
		type: Boolean,
		default: true
	},
	languages: [String],


	tenures: [TenureSchema],
	skills: [SkillSchema],
	qualifications: [QualificationSchema]
});

var TenureSchema = new Schema({
	position: {
		type: String,
		required: true
	},
	organization: {
		type: String,
		required: true
	},
	startedOn: {
		type: Date,
		required: true
	},
	endedOn: {
		type: Date,
		required: false
	},
	responsibilities: [String]
});

var SkillSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	experience: {
		type: Number,
		required: true
	}
});

var QualificationSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	field: {
		type: String,
		required: false
	},
	issuedBy: {
		type: String,
		required: false
	},
	startedOn: {
		type: Date,
		required: false
	},
	endedOn: {
		type: Date,
		required: false
	},
	complete: {
		type: Boolean,
		default: false
	},
	result: [{
		name: {
			type: String,
			required: true
		},
		value: {
			type: String,
			required: true
		}
	}]
});


/** 
 * virtuals.
 =================================================*/

/** 
 * methods.
 =================================================*/

UserSchema.methods = {
	authenticate: function(password) {
		if (this._hashedPassword == this.encryptPassword(password)) {
			return true;
		} else {
			return false;
		}
	},
	makeSalt: function() {
		return Math.round((new Date().valueOf() * Math.random())) + '';
	},
	encryptPassword: function(password) {
		if (!password) {
			return '';
		}

		try {
			var encrypted = crypto.createHmac('sha1', this.salt).update(password).digest('hex');
			return encrypted;
		} catch (err) {
			console.log(err);
			return '';
		}
	},
	sendVerificationMail: function(callback) {
		utility.sendMail(this.email,
			'Please confirm your e-mail',
			'Hello there! We noticed that someone - probably you - created an account at Grizzly using this e-mail address.' +
			'You can follow this link to get your account activated: ' + 
			config.web_client.url + 
			'/activate?email=' +
			encodeURIComponent(this.email) +
			'&token=' +
			encodeURIComponent(this.activationToken), function(err) {
				if (err) {
					callback(err);
				} else {
					callback();
				}
			}
		);
	}
}

/** 
 * statics.
 =================================================*/

UserSchema.statics.generateToken = function(callback) {
	return utility.generateKey();
}

/** 
 * middleware.
 =================================================*/

UserSchema.pre('save', function(next) {
	// update the last update date
	this.lastUpdatedOn = Date.now();
	next();
});

/** 
 * model.
 =================================================*/

mongoose.model('Classroom', ClassroomSchema);
