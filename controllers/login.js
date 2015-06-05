var express = require('express'),
    middleware = require('../middleware/middleware'),
    User = require('../models/users'),
    app = express();

var isAuthenticated = middleware.isAuthenticated;
var sessionAuthMiddleware = middleware.sessionAuthMiddleware;

app.get('/', isAuthenticated, function(req, res) {
   res.render('index.ejs', {
       info: req.flash('info'),
       success: req.flash('success')
   }); 
});

app.get('/login', isAuthenticated, function(req,res)
{
    res.render('login.ejs', 
    {
        error: req.flash("error"),
        success: req.flash("success"),
        info: req.flash("info")
    });
});

app.get('/accounts', sessionAuthMiddleware, function(req, res) {
   res.render('accounts.ejs', {
       success: req.flash('success')
   }); 
});

app.get('/feedback', sessionAuthMiddleware, function(req, res){
   res.render('feedback.ejs', {}); 
});

app.get('/settings', sessionAuthMiddleware, function(req,res){
   res.render('settings.ejs', {}); 
});

app.get('/feedbackresponse', sessionAuthMiddleware, function(req,res){
   res.render('feedbackresponse.ejs', {}); 
});

app.post('/feedbackresponse', sessionAuthMiddleware, function(req,res){
//   var fullname = req.query.fullname 
//   var regarding = req.query.regarding;
//   var feeling = req.query.feeling;
//   var comments = req.query.comments;
//   var recommend = req.query.recommend;
//   var name = req.query.name;
//   var comments2 = req.query.name;
});

app.post('/login', function(req, res){
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
               res.redirect('/accounts');
           } else {
               req.flash("error", "Invalid Username/Password");
               res.redirect('/');
           }
       }
    });
});

app.get('/newuser', function(req, res){
   res.render('signup.ejs', {
       error: req.flash("error")
       }); 
});

app.post('/newuser', function(req, res) {
    var username = req.param('username');
    var password = req.param('password'),
        password2 = req.param('password2');
    if(password == password2){
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
    } else {
        req.flash("error", "Passwords do not match");
        res.redirect('/newuser');
    }
});

app.get('/logout', function(req, res){
   req.session.user = null;
   req.user = null;
   
   req.flash('info', "You have been logged out.");
   res.redirect('/');
});


module.exports = app;