//===================================================================================================================
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% MODULE AREA %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//===================================================================================================================

var express = require("express");
var app = express();
var router = express.Router();

var mysql = require('mysql');
var bodyParser = require('body-parser');
var encrypt = require('bcrypt');

//===================================================================================================================
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% DATABASE AREA %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//===================================================================================================================

//Change these values once we know the credentials of the real database,
const DBhostname = 'localhost'; //The host name. Certainly won't be local host.
const DBuser = 'YOUR_USER_HERE'; //The user. Hopefully won't be root.
const DBpassword = 'YOUR_PASSWORD_HERE'; //The login for the user, if there *is* one.
const DBportNumber = 3306; //The port to connect from, default is 3306
const DBtitle = 'Test_StocksDB'; //The name of the database as specified in the SQL document.

//===================================================================================================================
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% SERVER AREA %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//===================================================================================================================
app.use(router);

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.listen(3000, function () {
    console.log('Stock application is listening on port 3000.');
});


//===================================================================================================================
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% FUNCTION AREA %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//===================================================================================================================
function database_entry(euname, eemail, efname, elname, epass, callback)
{
    //TODO: replace the values for the DB columns to whatever the db actually is.
    //Will return 1 or 0 based on whether or not there was an error.
    //So, first, we need to know what the hell it is that's in this req. I assume the form data is in here...somewhere.
    //If I can extract that data, I can then, FINALLY get in those SQL queries.
    const salt = 10; //For encryption
    var hasho = null; //The hash
    var valid = null; //Validation

    //We will skip hashing for now.

    hasho = epass;

    //OPEN CONNECTION TO DATABASE [TEMPORARY]
    var client  = mysql.createConnection({
        host: DBhostname,
        user: DBuser,
        password: DBpassword,
        port: DBportNumber,
        database: DBtitle
    });

    client.connect(function(err){if (err) throw err;});

    //BUILD THE SQL STATEMENT
    var SQL = "INSERT INTO Acc SET username = ?, email = ?, pass = ?";

    client.query(SQL, [euname, eemail, hasho], function (err, result) {
        if (err)
        {
            callback(err,null);
        }
        console.log(result);
    });

    //NEW SQL STATEMENT FOR THE OTHER TABLE
    SQL = "INSERT INTO FandLName SET username = ?, fname = ?, lname = ?";

    client.query(SQL, [euname, efname, elname], function (err, result) {
        if (err)
        {
            callback(err,null);
        }
        else
        {
            callback(null,null);
        }
        console.log(result);
        //return 1;
    });

    client.end();
}


//GOING
function database_check(cuname,cpass, callback)
{
    const salt = 10; //For encryption
    var hasho = null; //The hash
    var valid = null; //Validation

    //We will skip hashing for now.

    hasho = cpass;

    //OPEN CONNECTION TO DATABASE [TEMPORARY]
    var client  = mysql.createConnection({
        host: DBhostname,
        user: DBuser,
        password: DBpassword,
        port: DBportNumber,
        database: DBtitle
    });

    client.connect(function(err){if (err) throw err;});

    //BUILD THE SQL STATEMENT
    var SQL = "SELECT * FROM Acc WHERE username = ?";

    client.query(SQL, [cuname], function (err, row) {
        if(err)
        {
            callback(err,null);
        }
        else
        {
            //Does User Exist?
            if (row && row.length )
            {
                console.log('Case row was found!');
                // do something with your row variable

                //Does given password match stored password?
                if (String(hasho) === String(row[0].pass))
                {
                    //Then It's Okay.
                    console.log(row[0].username);

                    var data_return = [row[0].username, row[0].email];

                    callback(null, data_return);
                }
                else
                {
                    console.log('Bad Password. :c');
                    callback(true,null);
                }

            }
            else
            {
                console.log('No case row was found :( !');
                callback(true,null);
            }
        }

    });
}

//===================================================================================================================
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% PAGE GETS %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//===================================================================================================================
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

app.get("/submit", function(req,res){
    res.render("submit.ejs");
});

app.get("/register/error", function(req,res){
    res.render("register.ejs");
});

//===================================================================================================================
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% REGISTER AREA %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//===================================================================================================================
app.post('/register', function(req, res, next){
    //Now, what we do is check whether or not this had a valid.
    var user = String(req.body.username);
    var email = String(req.body.email);
    var firstname = String(req.body.fname);
    var lastname = String(req.body.lname);
    var pass = String(req.body.password);

    database_entry(user, email, firstname, lastname, pass, function(err,data){
        if (!err)
        {
            res.redirect('/')
        }
        else
        {
            //THIS IS A TEMPROARY FIX. FIND A WAY TO AVOID THE ERROR AND HAVE A CONTEXTUAL REDIRECT.
            res.render("register.ejs");
        }
    });
});


//===================================================================================================================
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% LOGIN AREA %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//===================================================================================================================
app.post('/login', function(req, res, next){
    //Now, what we do is check whether or not this had a valid.
    var user = String(req.body.username);
    var pass = String(req.body.password);

    database_check(user, pass, function(err,data){
        if (!err)
        {
            console.log(data[0]);
            var cook = "user="+String(data[0])+";";
            var cook2 = "email="+String(data[1])+";";
            var cookfull = cook + cook2;

            //TODO: Send back a cookie with the user and email
            res.setHeader('Set-Cookie', String(cook));
            res.setHeader('Set-Cookie', String(cook2));
            res.setHeader('Content-Type', 'text/plain');

            res.redirect('/home');

        }
        else
        {
            //THIS IS A TEMPROARY FIX. FIND A WAY TO AVOID THE ERROR AND HAVE A CONTEXTUAL REDIRECT.
            res.render("login.ejs");
        }
    });
});