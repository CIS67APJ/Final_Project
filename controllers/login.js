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

// app.post('/', function(req,res)
// {
//     var username = req.param('username');
//     var password = req.param('password');
//     UserModel.find({username}).exec(function(err,res)
//     {
//         if(!err){
//             if(password != UserModel.password){
//                 req.flash("error", "Incorrect username/password");
//                 res.redirect('/');
//             } else {
//                 res.redirect('/homepage');
//             }
//         } else {
//             req.flash("error", "Incorrect username/password");
//             res.redirect('/');
//         }
//     }
// );

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

app.get('/homepage', isAuthenticated, function(req, res) {
   res.send("you did it") 
});

module.exports = app;