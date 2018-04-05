var express = require('express');
var app = express();

app.get("/", function(req,res){
    res.render("landing", {title: 'Stock Portfolio Landing Page'});
});

module.exports = app;