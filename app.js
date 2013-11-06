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
console.log("db path %s" , config.db);
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
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
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
	res.send(501);
});

<<<<<<< HEAD
=======

>>>>>>> 2aa46283bcf8508ff019cf9b2aef2c0a557cf988
app.get('/classrooms/:classroomId/articles/search', function (req, res, next) {
	var classroomId = req.params.classroomId;
	var q = req.query.q;

	// res.send(200, {
	// 	classroomId: classroomId,
	// 	q: q
	// });

	Article.search({"match_all" : { }}, function (err, results) {
		if (err) 
			res.send(500, err);

		res.send(200, event.result)
	})
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
	
      var error,		
		classroom;

	console.log(req.body);

		// parsin JSON
	try {
		classroom = req.body;
	} catch (e) {
		error = {
			type: 'Validation',
			message: 'Invalid JSON'
		};

		res.send(400, error);
		return next(error.message);
	}

	var classroomSave = new Classroom({
		name: classroom.name,
		url: classroom.url
	});

	classroomSave.save(function (err, saved) {
		if (err)
			res.send(500, err);
		else
			res.send(200, saved);
	})

	


	// Classroom.findOne({
	// 	id: req.classroom.id,
	// }, function(err, result) {
	// 	if (err) {
	// 		res.send(500);
	// 		return next(err);
	// 	}
		
	// 	if (!result) {
	// 		res.send(500);
	// 		logger.log('error', 'BETTER_CALL_SAUL: 8FNH46');
	// 		return next(err);
	// 	}

	// 	if (classroom.name !== undefined) result.name = classroom.name;
	// 	if (classroom.url !== undefined) result.url = classroom.url;
	

	// 	result.save(function(err, saved) {
	// 		if (err && err.name === 'ValidationError') {
	// 			error = {
	// 				type: 'Validation',
	// 				message: err.Messages
	// 			};

	// 			res.send(400, {
	// 				error: error
	// 			});

	// 			logger.log('info', 'Validation error encountered while saving the "user".', {
	// 				input: JSON.stringify(classroom),
	// 				output: JSON.stringify(err)
	// 			});

	// 			return next(error.message);

	// 		} else if (err) { // if not validation, then this is probably an internal error
	// 			res.send(500);


	// 			logger.log('error', 'Error encountered while saving the following "user".', {
	// 				input: JSON.stringify(user),
	// 				output: JSON.stringify(err.Messages)
	// 			});

	// 			return next(error.output);
	// 		}

	// 		res.send(200, saved);
	// 	});
	// });

});

<<<<<<< HEAD
=======



>>>>>>> 2aa46283bcf8508ff019cf9b2aef2c0a557cf988
/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
  console.log('Loaded config: ' +  app.get('env'));
});