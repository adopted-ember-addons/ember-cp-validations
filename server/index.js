module.exports = function(app) {
  app.get('/docs', function(req, res){
    res.redirect('/docs/index.html');
  });
};
