var express = require('express'),
    middleware = require('../middleware/middleware'),
    UserModel = require('../models/users'),
    app = express();

var isAuthenticated = middleware.isAuthenticated;

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
    var username = req.params('username');
    var password = req.params('password');
    UserModel.getAuthenticated(username, password, function(err, user, reason){
        if(err) throw err;
        if(!user){
            req.flash("error", "Invalid username/password");
            res.redirect('/');
        } else {
            req.flash("success", "You have successfully logged in");
            res.redirect('/homepage');
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
        var newUser = new UserModel();
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



module.exports = app;