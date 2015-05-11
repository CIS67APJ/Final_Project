var express = require('express'),
    middleware = require('../middleware/middleware'),
    UserModel = require('../models/users'),
    app = express(),
    isAuthenticated = middleware.isAuthenticated;
    
app.get('/homepage', isAuthenticated, function(req, res) {
   res.send("you did it");
});




module.exports = app;