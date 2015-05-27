var express = require('express'), 
    app = express(),
    middleware = require('../middleware/middleware'),
    unirest = require('unirest');
    // q = require('q');
    
var sessionAuthMiddleware = middleware.sessionAuthMiddleware;

var getFBfeed = function(callback){
        var url = "https://graph.facebook.com/v2.3/";
        unirest.get(url + "me?fields=posts&access_token=CAACEdEose0cBAB70eHoi9GlZB35bwyV9kDCjDEu1QdBBDI4FEDojf4hdmQZB1OnGCkVWL411qpDSDUNUbGZAz3ZCpVBMjcVZAoVvkmVuTvkpyZAYOV8bFkZBsCs8gb9YxpZAVWyTRQUJjSW7eGPMR5xjvehX0FYd7MsTPpXGNxSEJ9Gk8xbisF6DbD2QOU0c7c1QpgsEZBKlqmJFJe7oW7eIUQoXlfo6CeXIZD")
        .end(function(response) {
            var myResponse = JSON.parse(response.body);
            var fbposts = myResponse.posts.data;
            callback(fbposts);
        });
};

var getTwitterFeed = function(callback) {
        unirest.get("https://api.twitter.com/1.1/statuses/home_timeline.json")
        .header("Authorization", 'OAuth oauth_consumer_key="PxLdLoUzZUZavc3weW2Wxkkkc", oauth_nonce="80bff06fa23cb6ef1552a41d9854f70c", oauth_signature="Q7rNx5VWTsoa4HNbZB6OmHTI8BE%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1432742680", oauth_token="3192358885-nKCo6W1Y6iXMqIfOx2C99uBSBeAceEeDjsYcLSR", oauth_version="1.0"')
        .end(function(response) {
            var body = response.body;
            callback(response.body);
        });
};

var getInstaFeed = function(callback){
    
}

app.get('/feeds', sessionAuthMiddleware, function(req, res, next){
      getFBfeed(function(fbposts) {
        getTwitterFeed(function(twitPosts) {
            res.render("posts.ejs", {
                facebook: fbposts,
                twitPosts: twitPosts,
                success: req.flash('success')
            })    
        });
    }); 
});

module.exports=app;

