var express = require('express'), 
    passport = require('passport'),
    app = express(),
    middleware = require('../middleware/middleware'),
    session = require('express-session'),
    querystring = require("querystring"),
    FacebookStrategy = require('passport-facebook').Strategy,
    fbConfig = require('../fbConfig'),
    unirest = require('unirest');
    // q = require('q');
    
var sessionAuthMiddleware = middleware.sessionAuthMiddleware;
var appID = fbConfig.info.appID;
var appSecret = fbConfig.info.appSecret;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: appID,
    clientSecret: appSecret,
    callbackURL:"https://final-project-git-ramip026.c9.io/FBauth/callback"
},
    function(accessToken, refreshToken, profile, done){
        process.nextTick(function(){
            return done(null, profile);
        });    
}));

var getTwitterFeed = function(callback) {
        unirest.get("https://api.twitter.com/1.1/statuses/home_timeline.json")
        .header("Authorization", 
            'OAuth oauth_consumer_key="PxLdLoUzZUZavc3weW2Wxkkkc", oauth_nonce="03d56caaa1bea8de95a37c1a355b348a", oauth_signature="kZFP8KMQoYasn6Vgr0vS3BKk8mo%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1433348397", oauth_token="3192358885-nKCo6W1Y6iXMqIfOx2C99uBSBeAceEeDjsYcLSR", oauth_version="1.0"')
        .end(function(response) {
            var body = response.body;
            callback(response.body);
        });
};

// var getInstaFeed = function(callback){
    
// }

app.get('/FBauth', passport.authenticate('facebook', { scope: 'read_stream' }) ,function(req, res, next){

});

app.get('/FBauth/callback', passport.authenticate('facebook', {failureRedirect: '/'}), function (req,res){
   res.redirect('/feeds'); 
});

app.get('/feeds', sessionAuthMiddleware, function(req, res, next){
    req.flash("success", "Hello, " + req.user.name.givenName + ". You have successfully logged in.");
    getTwitterFeed(function(twitPosts) {
        res.render("posts.ejs", {
            // facebook: fbposts,
            firstName: req.user.name.givenName,
            lastName: req.user.name.familyName,
            email: req.user.emails,
            twitPosts: twitPosts,
            success: req.flash('success')
        });
    });
});

module.exports=app;