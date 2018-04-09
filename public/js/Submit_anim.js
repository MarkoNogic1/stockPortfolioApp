
var mode = 0;
var t=setInterval(anim,500);

function anim()
{
    if (mode === 0)
    {
        mode = 1;
        document.getElementById("loading").textContent = ".."
    }
    else if (mode === 1)
    {
        mode = 2;
        document.getElementById("loading").textContent = "..."
    }
    else
    {
        mode = 0;
        document.getElementById("loading").textContent = "."
    }
}