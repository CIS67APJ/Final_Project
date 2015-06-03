var express = require('express'),
    session = require('express-session'),
    cookieparser = require('cookie-parser'),
    bodyparser = require('body-parser'),
    flash = require('connect-flash'),
    mongoose = require('mongoose'),
    config = require('./config'),
    passport = require('passport'),
    loginApp = require('./controllers/login'),
    feedsApp = require('./controllers/feeds'),
    app = express();
    
app.use(session({
    secret: "asdfasdfasdf"
}));
app.use(cookieparser('oiwnevlijas923q0w8u'));
app.use(bodyparser());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(loginApp);
app.use(feedsApp);


mongoose.connect(config.database.url);

app.listen(process.env.PORT);
