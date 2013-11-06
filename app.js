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

app.get('/classrooms', function (req,res,next) {
	res.send('hi there',200);
});

app.put('/', function (req,res,next) {
	res.send('hi there',200);
});



/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
  console.log('Loaded config: ' +  app.get('env'));
});