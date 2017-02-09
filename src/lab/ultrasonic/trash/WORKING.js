
var wert = 0;

change = function() {
    wert = wert + 1;
    console.log("-");
    setTimeout(change, 2000);
}

getWert = function() {
    console.log(wert);
    setTimeout(getWert, 5000);
}


change();
getWert();


