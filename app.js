var express = require('express'),
  http = require('http'),
  //Classroom      = require('./models/classroom'),
  //Article      = require('./models/article'),
  fs              = require('fs'),
  	env = process.env.NODE_ENV || 'development',
	config = require('./config')[env],
  mongoose = require('mongoose'),
  path = require('path');

// bootstrap db connection
mongoose.connect(config.db);

var models_path = __dirname + '/models';
fs.readdirSync(models_path).forEach(function(file) {
	if (~file.indexOf('.js')) require(models_path + '/' + file)
});
  
var Classroom = mongoose.model('Classroom');


var app = module.exports = express();


/**
 * Express Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
};


/**
 * Routes
 */

// serve index and view partials
app.get('/', function (req,res,next) {
	res.send('hi there',200);
});


app.get('/classrooms/:classroomId/articles/search', function (req, res, next) {
	
});

app.get('/classrooms', function (req,res,next) {
	
	Classroom.find({},function(error, classrooms) {
	      if(error) {
	         res.send(error,500);
	      }
	      else {
			 res.send(classrooms,200);
	      }
	  });

});

app.put('/classrooms', function (req,res,next) {
	

Classroom.findOne({
		id: req.classroom.id,
	}, function(err, result) {
		if (err) {
			res.send(500);
			return next(err);
		}

		logger.info(req.user.email);

		if (!result) {
			res.send(500);
			logger.log('error', 'BETTER_CALL_SAUL: 8FNH46');
			return next(err);
		}

		if (profile.firstName !== undefined) result.firstName = profile.firstName;
		if (profile.lastName !== undefined) result.lastName = profile.lastName;
		if (profile.dateOfBirth !== undefined) result.dateOfBirth = profile.dateOfBirth;
		if (profile.gender !== undefined) result.gender = profile.gender;
		if (profile.location !== undefined) result.location = profile.location;
		if (profile.contactNumbers !== undefined) result.contactNumbers = profile.contactNumbers;
		if (profile.nationalIdentifier !== undefined) result.nationalIdentifier = profile.nationalIdentifier;
		if (profile.isLookingOut !== undefined) result.isLookingOut = profile.isLookingOut;
		if (profile.languages !== undefined) result.languages = profile.languages;
		if (profile.tenures !== undefined) result.tenures = profile.tenures;
		if (profile.skills !== undefined) result.skills = profile.skills;
		if (profile.qualifications !== undefined) result.qualifications = profile.qualifications;

		result.save(function(err, saved) {
			if (err && err.name === 'ValidationError') {
				error = {
					type: 'Validation',
					message: err.Messages
				};

				res.send(400, {
					error: error
				});

				logger.log('info', 'Validation error encountered while saving the "user".', {
					input: JSON.stringify(user),
					output: JSON.stringify(err)
				});

				return next(error.message);

			} else if (err) { // if not validation, then this is probably an internal error
				res.send(500);


				logger.log('error', 'Error encountered while saving the following "user".', {
					input: JSON.stringify(user),
					output: JSON.stringify(err.Messages)
				});

				return next(error.output);
			}

			res.send(200, saved);
		});
	});



});




/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
  console.log('Loaded config: ' +  app.get('env'));
});