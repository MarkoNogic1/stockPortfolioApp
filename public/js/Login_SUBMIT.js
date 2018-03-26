var user;
var password_temp;

function formChanged()
{
    user = document.getElementsByName("username")[0].value;
    password_temp = document.getElementsByName("password")[0].value;

}

function submit()
{
    form_error_clear();
    var valid = true;

    //Here's where it gets complicated. So, we have our credentials. First we should check null.
    if (user === null || user === "")
    {
        form_entry_error(1, 0);
        valid = false;
    }

    if (password_temp === null || password_temp === "")
    {
        form_entry_error(0, 1);
        valid = false;
    }

    if (valid)
    {
        //So here, if this is valid, then we do a submit on the form section id'd as "regis", which will do a post
        //on the /register route. If all goes well. From there, there has to be a way to throw an error on the page
        //after the database check if the user already exists.
        document.getElementById('logform').submit();
    }
}

function form_entry_error(username_error, password_error)
{
    if (username_error === 1)
    {
        document.getElementById("username_error").style.visibility="visible";
    }

    if (password_error === 1)
    {
        document.getElementById("pass1_error").style.visibility="visible";
    }

}

function form_error_clear()
{
    document.getElementById("username_error").style.visibility="hidden";
    document.getElementById("pass1_error").style.visibility="hidden";
}