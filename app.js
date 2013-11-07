var express = require('express'),
    http = require('http'),
    fs = require('fs'),
    process = require('process'),
    env = process.env.NODE_ENV || 'development',
    config = require('./config')[env],
    mongoose = require('mongoose'),
    path = require('path'),
    request = require('request'),
    mashape_key = process.env.MASHAPE_KEY,
    pm = require('pagemunch'),
    amqp = require('./amqp'),
    path = require('path');


// pagemunch api key
pm.set({
    key: '477eab6e9740bf59ed932bc94d299cc1'
});

// bootstrap db connection
console.log("db path %s", config.db);
mongoose.connect(config.db);

var models_path = __dirname + '/models';
fs.readdirSync(models_path).forEach(function(file) {
    if (~file.indexOf('.js')) require(models_path + '/' + file)
});

var Classroom = mongoose.model('Classroom');
var Article = mongoose.model('Article');


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

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Origin, Accept, Authorization, x-csrf-token');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method.toLowerCase() === 'options') {
        res.send(200);
    } else {
        next();
    }
});

app.get('/', function(req, res, next) {
    res.send(501);
});

// classrooms

app.get('/classrooms/:classroomId/articles/search', function(req, res, next) {
    var classroomId = req.params.classroomId;
    var q = req.query.q;

    var q = {
        query: {
            fuzzy: {
                text: req.query.q
            }
        }
    }

    Article.search(q, function(err, results) {
        console.log('searching...');

        if (err) {
            console.log(err);
            res.send(500, err);
        }

        res.send(200, results)
    })
});

app.get('/classrooms', function(req, res, next) {

    amqp.send('doca message 1');
    amqp.send('doca message 2');
    Classroom.find({}, function(error, classrooms) {
        if (error) {
            res.send(error, 500);
        } else {
            res.send(classrooms, 200);
        }
    });

});

app.get('/classrooms/:classroomId', function(req, res, next) {

    Classroom.findOne({_id:req.params.classroomId}, function(error, classroom) {
        if (error) {
            res.send(error, 500);
        } else {
            res.send(classroom, 200);
        }
    });

});

app.put('/classrooms', function(req, res, next) {

    var croom = new Classroom({
        name: req.body.name
    });

    croom.save(function(err, saved) {
        if (err)
            res.send(500, err);
        else
            res.send(200, saved);
    });
});

// articles

app.get('/classrooms/:classroomId/articles', function(req, res, next) {
    Article.find({
        classroom: req.params.classroomId
    } ['summary', 'title', 'url', 'classroom', 'keywords'], function(error, articles) {
        if (error) {
            res.send(500, error);
        } else {
            res.send(200, articles);
        }
    });
});

app.put('/classrooms/:classroomId/articles', function(req, res, next) {
    console.log('----' + JSON.stringify(req.body));
    var url = req.body.url;
    var summary, keywords = [];

    var options = {
        uri: 'https://tldr.p.mashape.com/summary',
        qs: {
            url: url
        },
        headers: {}
    }

    options.headers["X-Mashape-Authorization"] = mashape_key;


    request.get(options, function(err, r, body) {
        if (err)
            res.send(500, err);

        body = JSON.parse(body);

        console.log('Got summary');

        console.log('-----', body);

        summary = body.data.summary;
        keywords = body.data.keywords;

        var article = new Article({
            url: url,
            summary: summary,
            keywords: keywords,
            classroom: req.params.classroomId
        });

        console.log(article);

        var options = {
            uri: 'https://alchemy.p.mashape.com/url/URLGetTitle',
            qs: {
                url: url,
                outputMode: "json"
            },
            headers: {}
        }

        options.headers["X-Mashape-Authorization"] = mashape_key;

        // pagemunch summary
        request.get(options, function(err, r, body) {
            if (err) {
                res.send(500, err);
                console.log(err);
            } else {
                body = JSON.parse(body);
                console.log('Got title');
                console.log('-----', body);
                article.title = body.title;
                console.log(article);

                var options = {
                    url: "https://alchemy.p.mashape.com/url/URLGetText",
                    qs: {
                        url: url,
                        outputMode: "json"
                    },
                    headers: {}
                }

                options.headers["X-Mashape-Authorization"] = mashape_key;

                request.get(options, function(err, r, body) {
                    if (err)
                        res.send(500, err);

                    body = JSON.parse(body);

                    console.log('Got raw text');
                    console.log('-----', body);
                    article.text = body.text;
                    console.log(article);

                    article.save(function(err, obj) {
                        if (err)
                            res.send(500, err);

                        res.send(201, {
                            id: obj._id
                        });
                    });
                });
            }
        })
    });
});

app.del('/classrooms/:classroomId/articles/:articleId', function(req, res, next) {
    Article.remove({
        classroom: classroomId,
        _id: articleId
    }, function(err) {
        if (err)
            res.send(500, err);
        else
            res.send(200);
    })

    res.send(501);
});

function indexContent(msg) {
    if (msg !== null) {
        console.log(msg.content.toString());
        //ch.ack(msg);
    }
}

amqp.initializeConsumer(indexContent);

/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
    console.log('Loaded config: ' + app.get('env'));

    if (mashape_key) {
        console.log("Mashape key is set");
    } else {
        console.log('Mashape key is not set');
    }
});
