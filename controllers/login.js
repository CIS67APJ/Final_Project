var express = require('express'),
    middleware = require('../middleware/middleware'),
    User = require('../models/users'),
    app = express();

var isAuthenticated = middleware.isAuthenticated;
var sessionAuthMiddleware = middleware.sessionAuthMiddleware;



app.get('/', isAuthenticated, function(req,res)
{
    res.render('login.ejs', 
    {
        error: req.flash("error"),
        success: req.flash("success"),
        info: req.flash("info")
    });
});

app.post('/', function(req, res){
    var username = req.param('username');
    var password = req.param('password');
    User.findOne({username:username}, function(err, user){
       if(err){
           res.redirect('/');
       } else if (!user) {
           req.flash("error", "Invalid Username/Password");
           res.redirect('/');
       } else {
           if(user.password == password){
               req.session.user = user;
               res.redirect('/restricted');
           } else {
               req.flash("error", "Invalid Username/Password");
               res.redirect('/');
           }
       }
    });
});

app.get('/newuser', function(req, res){
   res.render('newUser.ejs', {
       error: req.flash("error")
       }); 
});

app.post('/newuser', function(req, res) {
    var username = req.param('username');
    var password = req.param('password');
        if(username && password){
        var newUser = new User();
        newUser.username = username;
        newUser.password = password;
        newUser.save(function(err, Users){
            if(!err){
                req.flash("success", "User Created");
                res.redirect('/');
            } else {
                req.flash("error", "Account NOT created");
                res.redirect('/newuser');
            }
        });
    }
});

app.get('/restricted', sessionAuthMiddleware, function(req, res) {
    res.render('restricted.ejs', {});
});



module.exports = app;