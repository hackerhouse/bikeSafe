/*
 * GET the "Add Bike" page.
 */

exports.bikes = function(req, res){
    res.render('bikes', { title: 'Add a Bike' });
};

