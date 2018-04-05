var express = require('express');
var app = express();

app.get("/", function(req, res){
    res.render("register", {title: 'Registration'})
});

app.post("/", function(req, res){
    req.getConnection(function(error, conn){
        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password;
        conn.query("INSERT INTO User_Information (username, email, pass) VALUES (?,?,?)", [username, email, password], function(err, result){
            if(err) throw err;

            console.log("1 record inserted");
        });
        res.render("home", {title: 'HomePage'})});
});

module.exports = app;