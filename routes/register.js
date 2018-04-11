var express = require('express');
var app = express();
var db = require('../db');

app.get("/", function(req, res){
    res.render("register", {title: 'Registration'})
});

app.post("/", function(req, res){
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    db.query("INSERT INTO User_Information (username, email, pass) VALUES (?,?,?)", [username, email, password], function(err, result){
        if(err) throw err;
        console.log("1 record inserted");});
    res.render("home", {title: 'HomePage'});
});

module.exports = app;