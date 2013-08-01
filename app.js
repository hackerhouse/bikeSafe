
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
        res.redirect('/')
    });
});

var bikesModel = new BikesModel('localhost', 27017);
bikesModel.registerBike(
    {
    title: 'mine',
    name: 'Drew',
    serial: 'sadl38843948f'
},
function(error, received) {
    console.log(error);
    console.log(received);
}
);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
