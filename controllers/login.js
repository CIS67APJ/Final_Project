var express = require('express'),
    User = require('./models/users'),
    middleware = require('./middleware/middleware'),
    app = express();

app.get('/', middleware.isAuthenticated, function(req,res)
{
    res.render('login.ejs', 
    {
        
    });
});

app.post('/', function(req,res)
{
    var username = req.param('username');
    var password = req.param('password');
    User.find({username}, function(err,res)
    {
        if(!err){
            if(password != User.password){
                res.redirect('/');
            } else {
                res.redirect('/homepage');
            }
        } else {
            res.redirect('/');
        }
    });
});