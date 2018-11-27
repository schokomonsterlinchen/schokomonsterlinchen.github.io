function Quadrat() {
    var Eingabe  = document.getElementById('Eingabe');
    var Ergebnis = Eingabe.value * Eingabe.value;
    alert("Das Quadrat von " + Eingabe.value + " = " + Ergebnis);
    Eingabe.value = 0;
}

function create_array() {
    var array = [];
    array.push(["X-Aches", "Y-Achse"])
    var ergebnisX;
    var ergebnisY;
    for(var x = 1; x < 11; x++) {
            ergebnisX = x*10;
            ergebnisY = ergebnisX + 1;
            array.push([ergebnisX, ergebnisY]);
    }
    write_to_file.apply(this, array);
}

function write_to_file(...array)
{
  for(var x = 0; x < array.length; x++) {
      for(var y = 0; y < 2; y++) {
          alert("Array " + x + ";" + y + " = " + array[x][y]);
      }
  }
}

var los  = document.getElementById('los');
los.addEventListener ('click', create_array, true);