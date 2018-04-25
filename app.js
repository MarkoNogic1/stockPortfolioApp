//===================================================================================================================
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% MODULE AREA %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//===================================================================================================================

var express = require("express");
var app = express();
var router = express.Router();

var mysql = require('mysql');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var cookieSession = require('cookie-session');

//===================================================================================================================
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% DATABASE AREA %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//===================================================================================================================

//Change these values once we know the credentials of the real database,

/*
const DBhostname = 'csc490stockproject.cxwyjtmvrcxs.us-east-2.rds.amazonaws.com'; //The host name. Certainly won't be local host.
const DBuser = 'csc490'; //The user. Hopefully won't be root.
const DBpassword = 'phpSucks'; //The login for the user, if there *is* one.
const DBportNumber = 3306; //The port to connect from, default is 3306
const DBtitle = 'csc490a'; //The name of the database as specified in the SQL document.
*/

const DBhostname = 'localhost'; //The host name. Certainly won't be local host.
const DBuser = 'root'; //The user. Hopefully won't be root.
const DBpassword = ''; //The login for the user, if there *is* one.
const DBportNumber = 3306; //The port to connect from, default is 3306
const DBtitle = 'Test_StocksDB'; //The name of the database as specified in the SQL document.

//===================================================================================================================
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% SERVER AREA %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//===================================================================================================================
app.use(router);

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieSession({
    //THE SESSIONS USE THE VARIABLES:
    //uname - USERNAME
    //email - EMAIL
    name: 'session',
    keys: ["superSecretKeysGoHere"],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

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
    var valid = true;

    var salto = bcrypt.genSaltSync(salt);
    var hasho = bcrypt.hashSync(epass, salto);

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
    var SQL = "INSERT INTO User_Information SET username = ?, email = ?, pass = ?";

    client.query(SQL, [euname, eemail, hasho], function (error, result) {
        if (error)
        {
            //console.log("Some Error");
            //console.log(error);
            callback(error, null);
        }
    });

    //NEW SQL STATEMENT FOR THE OTHER TABLE. WE CAN MOVE ON. IF ONE FAILS, SO MUST THE OTHER
    SQL = "INSERT INTO Users SET username = ?, fname = ?, lname = ?";

    client.query(SQL, [euname, efname, elname], function (error, result) {
        if (error) {
            //console.log("Some Error 2");
            //console.log(error);
            callback(error, null);
        }
        else
        {
            callback(null, null);
        }
    });

    client.end();
}



function database_edit(euname, eemail, efname, elname, epass, ouname, callback)
{
    //TODO: replace the values for the DB columns to whatever the db actually is.
    //Will return 1 or 0 based on whether or not there was an error.
    //So, first, we need to know what the hell it is that's in this req. I assume the form data is in here...somewhere.
    //If I can extract that data, I can then, FINALLY get in those SQL queries.
    const salt = 10; //For encryption
    var valid = true;

    var salto = bcrypt.genSaltSync(salt);
    var hasho = bcrypt.hashSync(epass, salto);

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
    var SQL = "UPDATE User_Information SET username = ?, email = ?, pass = ? WHERE username = ?";

    client.query(SQL, [euname, eemail, hasho, ouname], function (error, result) {
        if (error)
        {
            //console.log("Some Error");
            //console.log(error);
            callback(error, null);
        }
    });


    //NEW SQL STATEMENT FOR THE OTHER TABLE. WE CAN MOVE ON. IF ONE FAILS, SO MUST THE OTHER
    SQL = "UPDATE Users SET username = ?, fname = ?, lname = ? WHERE username = ?";

    client.query(SQL, [euname, efname, elname, ouname], function (error, result) {
        if (error) {
            //console.log("Some Error 2");
            //console.log(error);
            callback(error, null);
        }
    });


    //Now to edit all stocks
    SQL = "UPDATE Stocks SET username = ? WHERE username = ?";

    client.query(SQL, [euname, ouname], function (error, result) {
        if (error) {
            //console.log("Some Error 2");
            //console.log(error);
            callback(error, null);
        }
    });

    SQL = "SELECT p.username, p.email, a.fname, a.lname, p.pass FROM User_Information AS p " +
        "JOIN Users AS a ON p.username = a.username " +
        "WHERE p.username = ?";

    client.query(SQL, [euname], function (err, row){
        var data_return = [row[0].username, row[0].email, row[0].fname, row[0].lname];

        callback(null, data_return);
    });


    client.end();
}


//GOING
function database_check(cuname, cpass, callback)
{

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
    var SQL = "SELECT p.username, p.email, a.fname, a.lname, p.pass FROM User_Information AS p " +
        "JOIN Users AS a ON p.username = a.username " +
        "WHERE p.username = ?";

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
                //console.log('Case row was found!');
                // do something with your row variable

                //Does given password match stored password?
                if (bcrypt.compareSync(cpass, String(row[0].pass)))
                {
                    //Then It's Okay.
                    //console.log(row[0].username);
                    var data_return = [row[0].username, row[0].email, row[0].fname, row[0].lname];

                    callback(null, data_return);

                }
                else
                {
                    //console.log('Bad Password. :c');
                    callback(true,null);
                }

            }
            else
            {
                //console.log('No case row was found :( !');
                callback(true,null);
            }
        }

    });
}

//===================================================================================================================
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% PAGE GETS %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//===================================================================================================================
app.get("/", function(req,res){
    res.render("landing.ejs");
});

app.get("/login", function(req,res){
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

app.get("/editUser", function(req,res){
    res.render("editUser.ejs");
});

//===================================================================================================================
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% FUNCTIONAL GETS %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//===================================================================================================================

app.get("/getnavbardata", function(req, res){
    //req.session.reload();
    var data = req.session;

    var sendback = data.uname + "&" + data.email + "&" + data.fname + "&" + data.lname;

    res.send(String(sendback));
});

app.get("/getPortfolioData", function(req, res){
    var SessData = req.session;
    var LOCALusern = String(SessData.uname);
    //Here we need to send the string back.
    var client  = mysql.createConnection({
        host: DBhostname,
        user: DBuser,
        password: DBpassword,
        port: DBportNumber,
        database: DBtitle
    });

    client.connect(function(err){if (err) throw err;});

    //BUILD THE SQL STATEMENT
    var SQL = "SELECT * FROM Stocks WHERE username = ?";

    //After the query, whatever we get back will be send. We'll sort it out back home.
    client.query(SQL, [LOCALusern], function (err, row){
        var senback = row;
        res.send(senback);
        client.end();
    });
});

app.get("/getSectors", function(req, res){
    //req.session.reload();
    var username = req.session.uname;
    var response;

    var client  = mysql.createConnection({
        host: DBhostname,
        user: DBuser,
        password: DBpassword,
        port: DBportNumber,
        database: DBtitle
    });

    client.connect(function(err){if (err) throw err;});

    //BUILD THE SQL STATEMENT
    var SQL = "SELECT DISTINCT sectorname FROM Stocks WHERE username = ?";

    //After the query, whatever we get back will be send. We'll sort it out back home.
    client.query(SQL, [username], function (err, row){
        response = row;
        res.send(response);
        client.end();
    });
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
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% EDIT USER AREA %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//===================================================================================================================
app.post('/editUser', function(req, res, next){
    //Now, what we do is check whether or not this had a valid.
    var user = String(req.body.username);
    var email = String(req.body.email);
    var firstname = String(req.body.fname);
    var lastname = String(req.body.lname);
    var pass = String(req.body.password);

    var sessData = req.session;

    database_edit(user, email, firstname, lastname, pass, sessData.uname, function(err,data){
        if (!err)
        {
            sessData.uname = String(data[0]);
            sessData.email = String(data[1]);
            sessData.fname = String(data[2]);
            sessData.lname = String(data[3]);

            res.redirect('/home')
        }
        else
        {
            //THIS IS A TEMPROARY FIX. FIND A WAY TO AVOID THE ERROR AND HAVE A CONTEXTUAL REDIRECT.
            res.render("editUser.ejs");
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
            //console.log(data[0]);
            //var cook = "user="+String(data[0])+";";
            //var cook2 = "email="+String(data[1])+";";
            //var cookfull = cook + cook2;

            //TODO: Send back a cookie with the user and email
            //res.setHeader('Set-Cookie', String(cook));
            //res.setHeader('Set-Cookie', String(cook2));
            //res.setHeader('Content-Type', 'text/plain');

            var sessData = req.session;
            sessData.uname = String(data[0]);
            sessData.email = String(data[1]);
            sessData.fname = String(data[2]);
            sessData.lname = String(data[3]);

            res.redirect('/home');

        }
        else
        {
            //THIS IS A TEMPROARY FIX. FIND A WAY TO AVOID THE ERROR AND HAVE A CONTEXTUAL REDIRECT.
            res.render("login.ejs");
        }
    });
});

//===================================================================================================================
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% ADD STOCK AREA %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//===================================================================================================================
app.post('/addstock', function(req, res, next) {

    //++ FORM DATA ++
    var name = String(req.body.StockName);
    var SNumer = String(req.body.ShareNumber);
    var SecName = String(req.body.SectorName);
    var DateA = String(req.body.DateAquired);
    var SValue = String(req.body.StockValue);

    //++ SESSION DATA++
    //++ USES UNAME ++
    //++ USES EMAIL ++
    var SessData = req.session;
    var LOCALusern = String(SessData.uname);

    var client = mysql.createConnection({
        host: DBhostname,
        user: DBuser,
        password: DBpassword,
        port: DBportNumber,
        database: DBtitle
    });

    //Here we just put in the stuff.
    client.connect(function (err) {if (err) throw err;});

    var SQL = "INSERT INTO Stocks SET username = ?, stockname = ?, sharesnumber = ?, sectorname = ?, dateaquired = ?, stockvalue = ?";

    client.query(SQL, [LOCALusern, name, SNumer, SecName, DateA, SValue], function (err, row){});

    client.end();

    res.redirect('/home');
});

//===================================================================================================================
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% REMOVE STOCK AREA %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//===================================================================================================================
app.post('/deletestock', function(req, res, next){
    var StockName = String(req.body.RemoveSelect);

    var SessData = req.session;
    var LOCALusern = String(SessData.uname);


    var client  = mysql.createConnection({
        host: DBhostname,
        user: DBuser,
        password: DBpassword,
        port: DBportNumber,
        database: DBtitle
    });

    client.connect(function(err){if (err) throw err;});

    var SQL = "DELETE FROM Stocks WHERE username = ? AND stockname = ?";

    //++ CHECK POSITION ++
    client.query(SQL, [LOCALusern, StockName], function (err, row){

    });

    client.end();

    res.redirect('/home');
});


//===================================================================================================================
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% EDIT STOCK AREA %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//===================================================================================================================
app.post('/editstock', function(req, res, next){
    //Okay, so this will be the grand combination of adding and deleting.
    //So, here's the steps:
    //1.) Pull the string down.
    //2.) Split it up
    //3.) If the Stock's ID does not match up, concat it into the new string.
    //4.) If the Stock's ID DOES match up, create a new stock from the specified values and concat that into the new string.
    //5.) When done, place that new string into the DB.

    var StockName = String(req.body.EditSelect);
    var StockDate = String(req.body.EditDate);
    var StockSector = String(req.body.EditSector);
    var StockShares = String(req.body.EditShares);
    var StockValue = String(req.body.EditValue);

    var SessData = req.session;
    var LOCALusern = String(SessData.uname);

    //So what we'll do is this:
    //1.) Load up the full string.
    //2.) Break up that string and find the sector with the matching number.
    //3.) Re-compile the list, sans the stock with the matching number
    //4.) Update the DB with the new list.

    var client  = mysql.createConnection({
        host: DBhostname,
        user: DBuser,
        password: DBpassword,
        port: DBportNumber,
        database: DBtitle
    });

    client.connect(function(err){if (err) throw err;});

    var SQL = "UPDATE Stocks SET sharesnumber = ?, sectorname = ?, dateaquired = ?, stockvalue = ? WHERE username = ? AND stockname = ?";

    client.query(SQL, [StockShares, StockSector, StockDate, StockValue, LOCALusern, StockName], function (err, row){

    });

    res.redirect('/home');


});


app.post("/getStocksBySector", function(req, res, next){
    //req.session.reload();
    var username = req.session.uname;
    var sectorName = req.body.sectorName;

    var client  = mysql.createConnection({
        host: DBhostname,
        user: DBuser,
        password: DBpassword,
        port: DBportNumber,
        database: DBtitle
    });

    client.connect(function(err){if (err) throw err;});

    //BUILD THE SQL STATEMENT
    var SQL = "SELECT stockname FROM Stocks WHERE username = ? AND sectorname = ?";

    //After the query, whatever we get back will be send. We'll sort it out back home.
    client.query(SQL, [username, sectorName], function (err, row){
        response = row;
        res.send(response);
        client.end();
    });
});

app.get("/getUserPortfolioData", function(req, res){
    var SessData = req.session;
    var LOCALusern = String(SessData.uname);
    //Here we need to send the string back.
    var client  = mysql.createConnection({
        host: DBhostname,
        user: DBuser,
        password: DBpassword,
        port: DBportNumber,
        database: DBtitle
    });

    client.connect(function(err){if (err) throw err;});

    //BUILD THE SQL STATEMENT
    var SQL = "SELECT sectorname, GROUP_CONCAT(stockname) as stocks FROM Stocks WHERE username = ? GROUP BY sectorname";

    //After the query, whatever we get back will be send. We'll sort it out back home.
    client.query(SQL, [LOCALusern], function (err, row){
        //console.log(row);
        res.send(row);
        client.end();
    });
});

app.post("/updateStockValue", function(req, res, next){
    //req.session.reload();
    var username = req.session.uname;
    var stockName = req.body.stockName;
    var stockValue = req.body.stockValue;

    var client  = mysql.createConnection({
        host: DBhostname,
        user: DBuser,
        password: DBpassword,
        port: DBportNumber,
        database: DBtitle
    });

    client.connect(function(err){if (err) throw err;});

    //BUILD THE SQL STATEMENT
    var SQL = "UPDATE stocks SET stockvalue = ? WHERE username = ? AND stockname = ?";

    //After the query, whatever we get back will be send. We'll sort it out back home.
    client.query(SQL, [stockValue, username, stockName], function (err, row){
        var response = row;
        res.send(response);
        client.end();
    });
});

app.get("/getSectorsWithPrices", function(req, res){
    var SessData = req.session;
    var LOCALusern = String(SessData.uname);
    //Here we need to send the string back.
    var client  = mysql.createConnection({
        host: DBhostname,
        user: DBuser,
        password: DBpassword,
        port: DBportNumber,
        database: DBtitle
    });

    client.connect(function(err){if (err) throw err;});

    //BUILD THE SQL STATEMENT
    var SQL = "select sectorname, TRUNCATE(SUM(stockvalue),2) as price from stocks where username = ? group by sectorname;";

    //After the query, whatever we get back will be send. We'll sort it out back home.
    client.query(SQL, [LOCALusern], function (err, row){
        //console.log(row);
        res.send(row);
        client.end();
    });
});

app.get("/getSummaryData", function(req, res){
    var SessData = req.session;
    var LOCALusern = String(SessData.uname);
    //Here we need to send the string back.
    var client  = mysql.createConnection({
        host: DBhostname,
        user: DBuser,
        password: DBpassword,
        port: DBportNumber,
        database: DBtitle
    });

    client.connect(function(err){if (err) throw err;});

    //BUILD THE SQL STATEMENT
    var SQL = "select stockname, stockvalue, sectorname from stocks where username = ?";

    //After the query, whatever we get back will be send. We'll sort it out back home.
    client.query(SQL, [LOCALusern], function (err, row){
        //console.log(row);
        res.send(row);
        client.end();
    });
});