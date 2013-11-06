var express = require('express'),
  http = require('http'),
  Classroom      = require('./models/classroom'),
  Article      = require('./models/article'),
  path = require('path');

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
	
	Classroom.findById(identityId, function(error, classrooms) {
	      if(error) {
	         res.send(error,500);
	      }
	      else {
			 res.send(classrooms,200);
	      }
	  });

});

app.put('/classrooms', function (req,res,next) {
	res.send('hi there',200);
});

/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
  console.log('Loaded config: ' +  app.get('env'));
});