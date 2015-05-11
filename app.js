var express = require('express'),
    session = require('express-session'),
    cookieparser = require('cookie-parser'),
    bodyparser = require('body-parser'),
    flash = require('connect-flash'),
    mongoose = require('mongoose'),
    config = require('./config'),
    loginApp = require('./controllers/login'),
    homepageApp = require('./controllers/homepage'),
    client = require('twitter'),
    app = express();
    
app.use(session({
    secret: "asdfasdfasdf"
}));
app.use(cookieparser('oiwnevlijas923q0w8u'));
app.use(bodyparser());
app.use(flash());

app.use(loginApp);
app.use(homepageApp);

mongoose.connect(config.database.url);

app.listen(process.env.PORT);
