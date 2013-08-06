/*
 * GET the "Add Bike" page.
 */

var BikesModel = require('../bikeDB.js').BikesModel;
var bikesModel = new BikesModel('localhost', 27017);

exports.bikes = function(req, res){
    bikesModel.findAll(function(error, bikes){
        res.render('bikes', 
                   {   total_bikes: bikes.length,
                       registered_bikes: bikes
                   }
                  );
    });
};

