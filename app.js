var express          = require("express");
var app              = express();
var bodyParser       = require("body-parser");
var expressValidator = require('express-validator');
var session          = require('express-session');

var db          = require('./db');
var landing     = require('./routes/landing');
var home        = require('./routes/home');
var register    = require('./routes/register');
var login       = require('./routes/login');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(session({ secret: 'secretKey', cookie: { maxAge: 60000 }}));
app.set("view engine", "ejs");

app.use('/', landing);
app.use('/home', home);
app.use('/register', register);
app.use('/login', login);

app.listen(3000, function(){
    console.log("Stock app is starting")
});