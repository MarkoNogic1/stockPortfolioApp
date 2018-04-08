//===================================================================================================================
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% MODULE AREA %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//===================================================================================================================

var express = require("express");
var app = express();
var router = express.Router();

var mysql = require('mysql');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var cookieSession = require('cookie-session');

//===================================================================================================================
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% DATABASE AREA %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//===================================================================================================================

//Change these values once we know the credentials of the real database,

const DBhostname = 'csc490stockproject.cxwyjtmvrcxs.us-east-2.rds.amazonaws.com'; //The host name. Certainly won't be local host.
const DBuser = 'csc490'; //The user. Hopefully won't be root.
const DBpassword = 'phpSucks'; //The login for the user, if there *is* one.
const DBportNumber = 3306; //The port to connect from, default is 3306
const DBtitle = 'csc490a'; //The name of the database as specified in the SQL document.

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
    var SQL = "INSERT INTO User_Information SET username = ?, email = ?, pass = ?, portfolio = null";

    client.query(SQL, [euname, eemail, hasho], function (error, result) {
        if (error)
        {
            console.log("Some Error");
            console.log(error);
            callback(error, null);
        }
    });

    //NEW SQL STATEMENT FOR THE OTHER TABLE. WE CAN MOVE ON. IF ONE FAILS, SO MUST THE OTHER
    SQL = "INSERT INTO Users SET username = ?, fname = ?, lname = ?";

    client.query(SQL, [euname, efname, elname], function (error, result) {
        if (error) {
            console.log("Some Error 2");
            console.log(error);
            callback(error, null);
        }
        else
        {
            callback(null, null);
        }
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
    var SQL = "SELECT * FROM User_Information WHERE username = ?";

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
                if (bcrypt.compareSync(cpass, String(row[0].pass)))
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
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% FUNCTIONAL GETS %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//===================================================================================================================

app.get("/getnavbardata", function(req, res){
    //req.session.reload();
    var data = req.session;

    var sendback = data.uname + "&" + data.email;

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
    var SQL = "SELECT portfolio FROM User_Information WHERE username = ?";

    //After the query, whatever we get back will be send. We'll sort it out back home.
    client.query(SQL, [LOCALusern], function (err, row){
        var PortfolioSerial = String(row[0].portfolio);
        res.send(PortfolioSerial);
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
app.post('/addstock', function(req, res, next){

    //++ FORM DATA ++
    var name = String(req.body.StockName);
    var SNumer = String(req.body.ShareNumber);
    var SecNumer = String(req.body.SectorNumber);
    var DateA = String(req.body.DateAquired);

    //++ SESSION DATA++
    //++ USES UNAME ++
    //++ USES EMAIL ++
    var SessData = req.session;
    var LOCALusern = String(SessData.uname);

    //=======================================================================
    //WHAT TO DO:
    //OPEN DB CONNECTION
    //SELECT FROM PORTFOLIO WHERE ROW = REQ.SESSION.USER
        //LIST = RESULT
        //ARR = LIST.SPLIT(&)
        //var i = 0
        //for length(arr)
            //i++
        //NewString = i + "^" + req.body.stockname + "^" + etcetc + "&"
        //NEWLIST = LIST + NewString
        //SQL = UPDATE user_info SET portfolio = ? WHERE user = ?
        //client.query(SQL, [NEWLIST, req.session.user])
            //client.close
    //=======================================================================


    /*
    ========================= IMPORTANT INFORMATION =========================
        ++STOCKS ARE SAVED INTO A STRING IN THE FOLLOWING FORMAT:
            ID NUMBER ^ NAME ^ NUMBER OF SHARES ^ SECTOR ^ DATE &
            With & denoting the end of the stock

        ++STOCKS ARE NUMBERED 0 TO N
    */
    var client  = mysql.createConnection({
        host: DBhostname,
        user: DBuser,
        password: DBpassword,
        port: DBportNumber,
        database: DBtitle
    });

    client.connect(function(err){if (err) throw err;});

    //BUILD THE SQL STATEMENT
    var SQL = "SELECT portfolio FROM User_Information WHERE username = ?";

    //++ CHECK POSITION ++
    client.query(SQL, [LOCALusern], function (err, row){
        if(err)
        {
            console.log(err);
        }

        //First and foremost we have to determine the ID, which will always be either 1 if the thing is empty or
        //+1 from the highest valued ID.
        var ID=1;
        var oldString = String(row[0].portfolio);
        console.log(oldString);

        if (oldString !== 'null')
        {
            var ARR = oldString.split('&');

            for(var index = 0; index < ARR.length; ++index)
            {
                var test = ARR[index];
                //Make sure it's note one of those dang tail-end ones.
                if(test !== undefined && test !== 'undefined' && test !== 'null' && test !== null && test !== '')
                {
                    var values = test.split("^");
                    if(parseInt(values[0]) > ID)
                    {
                        ID=parseInt(values[0]);
                    }
                }

            }
            //At this juncture, we have the highest ID value in the list.
            ID=ID+1; //One-up it.
        }

        //CREATE NEW STRING
        var NewString = String(ID)+"^"+name+"^"+SNumer+"^"+SecNumer+"^"+DateA+"&";
        var NewList;

        console.log(NewString);
        console.log(oldString);
        if (oldString === 'null')
        {
            NewList = String(NewString);
        }
        else
        {
            console.log("NO GET OUT");
            NewList = oldString + String(NewString);
        }

        console.log(NewList);

        //UPDATE DB
        SQL = "UPDATE User_Information SET portfolio = ? WHERE username = ?";
        client.query(SQL, [NewList, LOCALusern], function (err, row){
            if(err)
            {
                console.log(err);
            }
            client.end();
            res.redirect('/home');
        })
    });
});

//===================================================================================================================
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% REMOVE STOCK AREA %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//===================================================================================================================
app.post('/deletestock', function(req, res, next){
    var StockNum = String(req.body.RemoveSelect);

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

    var SQL = "SELECT portfolio FROM User_Information WHERE username = ?";

    //++ CHECK POSITION ++
    client.query(SQL, [LOCALusern], function (err, row){
        if(err)
        {
            console.log(err);
        }

        var oldString = String(row[0].portfolio);

        //So long as there's something in old string...
        if (oldString !== 'null')
        {
            //We'll split old string into an array, then go down the whole list. If any of these have their value
            //matching the one given, we skip over it in concatenating with the new string that will overwrite the
            //old one in the DB
            var arr = oldString.split("&");
            var NewString = "";

            for (var index = 0; index < arr.length; ++index)
            {
                var TestStock = arr[index];
                //The split function will counter the nothing after the last & as its own object. SO make sure
                //We're not there.
                if (TestStock !== undefined && TestStock !== 'undefined' && TestStock !== 'null' && TestStock !== null && TestStock !== '')
                {
                    var values = TestStock.split("^");

                    //Here's the check to see if the saved stock's ID is the same as the one the user provided.
                    //Also making sure Test Stock isn't undefined since, well, the split method will count the nothing
                    //after the last &
                    if(values[0] !== StockNum)
                    {
                        //If they don't match, then the stock is welcome aboard the newstring. Otherwise, it's not, and
                        //is left out.
                        TestStock = TestStock + "&";
                        NewString = NewString + TestStock;
                    }
                }

            }

            //At this juncture we have our new string to put into the database.
            SQL = "UPDATE User_Information SET portfolio = ? WHERE username = ?";
            client.query(SQL, [NewString, LOCALusern], function (err, row) {
                if (err) {
                    console.log(err);
                }
                client.end();
                res.redirect('/home');
            });
        }
        else
        {
            client.end(); //SQUICKY. First to go.
            res.redirect('/home');
        }

    });
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

    var StockNum = String(req.body.EditSelect);
    var StockDate = String(req.body.EditDate);
    var StockSector = String(req.body.EditSector);
    var StockShares = String(req.body.EditShares);

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

    var SQL = "SELECT portfolio FROM User_Information WHERE username = ?";

    client.query(SQL, [LOCALusern], function (err, row){
        if(err)
        {
            console.log(err);
        }

        var oldString = String(row[0].portfolio);

        //So long as there's something in old string...
        if (oldString !== 'null')
        {
            //We'll split old string into an array, then go down the whole list. If any of these have their value
            //matching the one given, we build a new string to take the old string's place in the larger string.
            var arr = oldString.split("&");
            var NewString = "";

            for (var index = 0; index < arr.length; ++index)
            {
                var TestStock = arr[index];
                //The split function will counter the nothing after the last & as its own object. SO make sure
                //We're not there.
                if (TestStock !== undefined && TestStock !== 'undefined' && TestStock !== 'null' && TestStock !== null && TestStock !== '')
                {
                    var values = TestStock.split("^");

                    //Here's the check to see if the saved stock's ID is the same as the one the user provided.
                    //Also making sure Test Stock isn't undefined since, well, the split method will count the nothing
                    //after the last &
                    if(values[0] !== StockNum)
                    {
                        //If they don't match, then the stock is welcome aboard the newstring. Otherwise, it's not, and
                        //is left out.
                        TestStock = TestStock + "&";
                        NewString = NewString + TestStock;
                    }
                    else
                    {
                        //If they DO match, we create a new string to take its place.
                        var ReplacementString = StockNum+"^"+values[1]+"^"+StockShares+"^"+StockSector+"^"+StockDate+"&";
                        NewString = NewString + ReplacementString;
                    }
                }

            }

            //At this juncture we have our new string to put into the database.
            SQL = "UPDATE User_Information SET portfolio = ? WHERE username = ?";
            client.query(SQL, [NewString, LOCALusern], function (err, row) {
                if (err) {
                    console.log(err);
                }
                client.end();
                res.redirect('/home');
            });
        }
        else
        {
            client.end(); //SQUICKY. First to go.
            res.redirect('/home');
        }

    });


});