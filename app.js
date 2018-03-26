var express = require("express");
var app = express();

app.use(express.static(__dirname + '/public'));

app.get("/", function(req,res){
    res.render("login.ejs");
});

app.get("/home", function(req,res){
    res.render("home.ejs");
});

app.get("/editPortfolio", function(req,res){
    res.render("editPortfolio.ejs");
});

app.get("/viewStock", function(req,res){
    res.render("viewStock.ejs");
});

app.get("/viewSector", function(req,res){
    res.render("viewSector.ejs");
});

app.get("/register", function(req,res){
    res.render("register.ejs");
});




app.listen(3000, function () {
    console.log('Stock application is listening on port 3000.');
});
