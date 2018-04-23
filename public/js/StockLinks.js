function myFunction2(){
  document.getElementById('stockLinksButton').disabled = true;
  var refTable = document.getElementById('stockinfo');
  stocklinkssection = document.createElement('div');
  stocklinkssection.className = "col-lg-12";

  theheader = document.createElement('h1');
  theheader.className = "page-header";
  theheader.innerHTML = "Stock Links Section";
  stocklinkssection.appendChild(theheader);

  //alert(document.getElementById('stockinfo').rows.length);
  for (var i = 1; i < refTable.rows.length; i++)
  {
    //gets cells of current row
   var oCells = refTable.rows.item(i).cells;

   console.log(oCells[0].innerHTML);
   a = document.createElement('a');
   a.href = "https://www.google.com/search?q=stock+" + oCells[0].innerHTML;
   a.innerHTML = oCells[0].innerHTML;

   newp = document.createElement('p');
   newp.appendChild(a);

   stocklinkssection.appendChild(newp);

  }
  document.getElementById('rowdiv').appendChild(stocklinkssection);
}