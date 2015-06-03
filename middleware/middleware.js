module.exports.sessionAuthMiddleware = function(req, res, next){
    if(!req.session.user){
        req.flash("error", "Need to be logged in to access");
        res.redirect('/');
    } else {
        next();
    }
};

module.exports.isAuthenticated = function(req, res, next){
  if(!req.session.user){
      next();
  }  else {
      res.redirect('/feeds');
  }
};