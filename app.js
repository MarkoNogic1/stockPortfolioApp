var express          = require("express");
var app              = express();
var bodyParser       = require("body-parser");
var mysql            = require('mysql');
var myConnection     = require('express-myconnection');
var config           = require('./config');
var expressValidator = require('express-validator');
var passport         = require('passport');
var LocalStrategy    = require('passport-local');

var dbOptions = {
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    port: config.database.port,
    database: config.database.database
};

//Pools connections and then kills them once they've been used
app.use(myConnection(mysql, dbOptions, 'pool'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(expressValidator());
app.set("view engine", "ejs");

var landing     = require('./routes/landing');
var home        = require('./routes/home');
var register    = require('./routes/register');
var login       = require('./routes/login');

app.use('/', landing);
app.use('/home', home);
app.use('/register', register);
app.use('/login', login);

app.listen(3000, function(){
    console.log("Stock app is starting")
});