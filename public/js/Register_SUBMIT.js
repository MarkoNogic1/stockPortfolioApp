//In order to get this hoss working we need a vague understanding of Node.js so we can communicate to the database old
//man Marko is making.
//Now then, getting the data input into the forms is easy:
//
//var firstName = document.getElementsByName("firstname")[0].value
//
//so for register, we have "username", "email", "fname", "lname", and "password"
//So we can use the code above to nab our variables.
//Now then, good practice here:
//Every time a key is decompressed, you can have a form call a javascript function to update the variables:
//
//<input type="text" name="firstname" onkeyup="formChanged()" onchange="formChanged()"/>
//
//Here, formChanged() would be a function where you do:
//var User = document.getElementsByName("username")[0].value
//var email = document.getElementsByName("email")[0].value
//etc etc
//Every single time a key is decompressed while typing in that form. So the variables would be changing on the fly and
//thus would be perfectly updated when you hit "submit"

// == REQUIRED MODULES ==
//var mysql = require('mysql');
//var encrypt = require('bcrypt');

var user;
var email;
var firstname;
var lastname;
var password_temp;
var password_re;

function formChanged()
{
    user = document.getElementsByName("username")[0].value;
    email = document.getElementsByName("email")[0].value;
    firstname = document.getElementsByName("fname")[0].value;
    lastname = document.getElementsByName("lname")[0].value;
    password_temp = document.getElementsByName("password")[0].value;
    password_re = document.getElementsByName("repassword")[0].value;
}

function submit()
{
    form_error_clear();
    var valid = true;
    var success = false;
    //Here's where it gets complicated. So, we have our credentials. First we should check null.
    if (user === null || user === "")
    {
        form_entry_error(1, 0, 0, 0);
        valid = false;
    }

    if (email === null || email === "")
    {
        form_entry_error(0, 1, 0, 0);
        valid = false;
    }

    if (firstname === null || firstname === "")
    {
        form_entry_error(0, 0, 0, 1);
        valid = false;
    }

    if (lastname === null || lastname === "")
    {
        form_entry_error(0, 0, 0, 1);
        valid = false;
    }

    if (password_temp === null || password_temp === "")
    {
        form_entry_error(0, 0, 1, 0);
        valid = false;
    }

    if (password_re === null || password_re === "")
    {
        form_entry_error(0, 0, 1, 0);
        valid = false;
    }

    //Next, we'll check to see if the passwords match.
    if (password_temp !== password_re)
    {
        form_entry_error(0, 0, 1, 0);
        valid = false;
    }

    //It's a little janky, but it works ok. So, now, with valid being true, we'll try inputting all this into
    //The Dabbabasse. The only other error past this is there being a duplicate username and duplicate email.
    //That'll probably be handled by the database itself.
    //Step one is to open up a connection to the database.
    if (valid)
    {
        //So here, if this is valid, then we do a submit on the form section id'd as "regis", which will do a post
        //on the /register route. If all goes well. From there, there has to be a way to throw an error on the page
        //after the database check if the user already exists.

        document.getElementById('regform').submit();

    }


}

function form_entry_error(username_error, email_error, password_error, name_error)
{
    if (username_error === 1)
    {
        document.getElementById("username_error").style.visibility="visible";
    }
    if (email_error === 1)
    {
        document.getElementById("email_error").style.visibility="visible";
    }

    if (password_error === 1)
    {
        document.getElementById("pass1_error").style.visibility="visible";
        document.getElementById("pass2_error").style.visibility="visible";
    }

    if (name_error === 1)
    {
        document.getElementById("fname_error").style.visibility="visible";
        document.getElementById("lname_error").style.visibility="visible";
    }
}

function form_error_clear()
{
    document.getElementById("username_error").style.visibility="hidden";
    document.getElementById("email_error").style.visibility="hidden";
    document.getElementById("pass1_error").style.visibility="hidden";
    document.getElementById("pass2_error").style.visibility="hidden";
    document.getElementById("fname_error").style.visibility="hidden";
    document.getElementById("lname_error").style.visibility="hidden";
}
