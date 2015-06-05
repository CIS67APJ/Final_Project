var express = require('express'), 
    passport = require('passport'),
    app = express(),
    middleware = require('../middleware/middleware'),
    session = require('express-session'),
    querystring = require("querystring"),
    FacebookStrategy = require('passport-facebook').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    fbConfig = require('../fbConfig'),
    twitConfig = require('../twitConfig'),
    User = require('../models/users'),
    unirest = require('unirest');
    // q = require('q');
    
var sessionAuthMiddleware = middleware.sessionAuthMiddleware;
var appID = fbConfig.info.appID;
var appSecret = fbConfig.info.appSecret;
var conKey = twitConfig.info.conKey;
var conSec = twitConfig.info.conSec;

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

// passport.use(new TwitterStrategy({
//     consumerKey: conKey,
//     consumerSecret: conSec,
//     callbackURL: "https://final-project-git-ramip026.c9.io/twitAuth/callback",
//     passReqToCallback: true
// },
//       function(req, token, tokenSecret, profile, done) {
//     // asynchronous verification, for effect...
//     process.nextTick(function () {
      
//       // To keep the example simple, the user's Twitter profile is returned to
//       // represent the logged-in user.  In a typical application, you would want
//       // to associate the Twitter account with a user record in your database,
//       // and return that user instead.
//       return done(null, req.user);
//     });
//   }
// ));

// passport.use('twitter-authz', new TwitterStrategy({
//     consumerKey: conKey,
//     consumerSecret: conSec,
//     callbackURL: "https://final-project-git-ramip026.c9.io/twitAuth/callback"
//   },
//   function(token, tokenSecret, profile, done) {
//     User.findOne({ domain: 'twitter.com', uid: User.id }, function(err, account) {
//       if (err) { return done(err); }
//       if (account) { return done(null, account); }

//       var user = new User();
//       user.domain = 'twitter.com';
//       user.uid = User.id;
//       var t = { kind: 'oauth', token: token, attributes: { tokenSecret: tokenSecret } };
//       account.tokens.push(t);
//       return done(null, account);
//     });
//   }
// ));


// var getTwitterFeed = function(callback) {
//         unirest.get("https://api.twitter.com/1.1/statuses/home_timeline.json")
//         .header("Authorization", 
//             'OAuth oauth_consumer_key="PxLdLoUzZUZavc3weW2Wxkkkc", oauth_nonce="03d56caaa1bea8de95a37c1a355b348a", oauth_signature="kZFP8KMQoYasn6Vgr0vS3BKk8mo%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1433348397", oauth_token="3192358885-nKCo6W1Y6iXMqIfOx2C99uBSBeAceEeDjsYcLSR", oauth_version="1.0"')
//         .end(function(response) {
//             var body = response.body;
//             callback(response.body);
//         });
// };

// var getInstaFeed = function(callback){
    
// }

app.get('/FBauth', sessionAuthMiddleware, passport.authenticate('facebook', { scope: 'read_stream' }) ,function(req, res, next){

});

app.get('/FBauth/callback', passport.authenticate('facebook', {failureRedirect: '/'}), function (req,res){
   res.redirect('/accounts'); 
});

// app.get('/twitauth', passport.authorize('twitter-authz'), function(req,res){

// });

// app.get('/connect/twitter/callback',
//   passport.authorize('twitter-authz', { failureRedirect: '/account' }),
//   function(req, res) {
//     var user = req.user;
//     var account = req.account;

//     // Associate the Twitter account with the logged-in user.
//     account.userId = user.id;
//     account.save(function(err) {
//       if (err) { return self.error(err); }
//       self.redirect('/');
//     });
//   }
// );

app.get('/feeds', sessionAuthMiddleware, function(req, res, next){
    if(!req.user){
        req.flash('error', 'Please add a social media account before continuing');
        res.redirect('/accounts');
    } else {
    req.flash("success", "Hello, " + req.user.name.givenName + ". You have successfully logged in.");
    // getTwitterFeed(function(twitPosts) {
        res.render("feeds.ejs", {
            // facebook: fbposts,
            firstName: req.user.name.givenName,
            lastName: req.user.name.familyName,
            email: req.user.emails,
            // twitPosts: twitPosts,
            success: req.flash('success')
        });
    // });
    }
});

module.exports=app;