function myFunction() {
  //What to do:
  //XMLrequest for the database's string.
  //Break it apart and call the function for each entry.
  var xhttp = new XMLHttpRequest();
  xhttp.open( "GET", "/getPortfolioData", false);
  xhttp.send();
  var answer = xhttp.responseText;
  //What to do when the data is ready.
  /*xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200 && this.responseText !== undefined && this.responseText !== 'undefined' && this.responseText !== 'null' && this.responseText !== null && this.responseText !== '')
    {
      var longstring = this.responseText;
    }
  }
  */
  var para = document.createElement("P");
  var t = document.createTextNode(answer);
  para.appendChild(t);
  document.getElementsByClassName("col-lg-12")[0].appendChild(para);
}

myFunction();
