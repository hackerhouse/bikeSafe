var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

BikesModel = function(host, port) {
  this.db = new Db('bikes', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


BikesModel.prototype.getCollection = function(callback) {
  this.db.collection('bikes', function(error, bikes_collection) {
    if( error ) callback(error);
    else callback(null, bikes_collection);
  });
};

// find all bikes
BikesModel.prototype.findAll = function(callback) {
    this.getCollection(function(error, bikes_collection) {
      if( error ) callback(error)
      else {
        bikes_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

// register a new bike
BikesModel.prototype.registerBike = function(bikes, callback) {
    this.getCollection(function(error, bikes_collection) {
      if( error ) callback(error)
      else {
        if( typeof(bikes.length) == "undefined")
          bikes = [bikes];

        for( var i = 0; i < bikes.length; i++ ) {
          bike = bikes[i];
          bike.created_at = new Date();
        }

        bikes_collection.insert(bikes, function() {
          callback(null, bikes);
        });
      }
    });
};

exports.BikesModel = BikesModel;
