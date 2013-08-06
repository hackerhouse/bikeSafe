
/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')
, bikes = require('./routes/bikes')
, map = require('./routes/map')
, user = require('./routes/user')
, http = require('http')
, path = require('path')
, fs = require('fs')
, BikesModel = require('./bikeDB.js').BikesModel;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'hjs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/bikes', bikes.bikes);
app.get('/map', map.map);
app.get('/users', user.list);
app.post('/bikes/new', function(req, res){
    bikesModel.registerBike({
        serial: req.param('serial')
    }, function( error, docs) {
        console.log(error);
        console.log(docs);
        res.redirect('/bikes')
    });
});

app.post('/bikes/photo', function(req, res) {
    console.log(req.files.file);
        fs.readFile(req.files.file.path, function (err, data) {
            // ...
            if (err) { console.log(err); }
            var newPath =  "./public/images/uploads/photo.jpg";
            fs.writeFile(newPath, data, function (err) {
                if (err) console.log(err);
            });
        }); 
});
app.get('/bikes/all', function(req, res) {
    bikesModel.findAll(function(error, bikes) {
        res.send(bikes);
    });
});

var handlePhotos = function(req, res) {
    console.lgo(req);
    console.lgo(res);
};

var bikesModel = new BikesModel('localhost', 27017);
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
