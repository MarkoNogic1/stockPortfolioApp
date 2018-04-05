var express = require('express');
var app = express();

app.get("/", function(req, res){
    res.render("login", {title: 'Login Page'})
});

app.post("/", function(req,res){
    var email= req.body.email;
    var password = req.body.password;
    console.log(email);
    console.log(password);
    req.getConnection(function(error, conn){
        conn.query('SELECT * FROM user_info WHERE email = ?',[email], function (error, results, fields) {
        if (error) {
            // console.log("error ocurred",error);
            res.send({
                "code":400,
                "failed":"error ocurred"
            })
        }else{
            // console.log('The solution is: ', results);
            if(results.length >0){
                for(i = 0; i < results.length; i++){
                    console.log(results[i])
                };
                if(results[0].password == password){
                    var email = results[0].email;
                    var pass = results[0].password;
                    res.render("home", {title: 'Homepage', userEmail: email, userPass: pass});
                }
                else{
                    res.send({
                        "code":204,
                        "success":"Email and password does not match"
                    });
                }
            }
            else{
                res.send({
                    "code":204,
                    "success":"Email does not exits"
                });
            }
        }
    })});
});

module.exports = app;