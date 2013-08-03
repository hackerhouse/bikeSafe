/*
 * GET map page.
 */

exports.map = function(req, res){
  res.render('map', { title: 'Map' });
};
