var express = require("express");
var app = express();

app.get("/", function (req,res) {
    res.render("home.ejs");
})

app.listen(3000, function () {
    console.log("Server has started!")
});