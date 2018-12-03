var ab  = document.getElementById('ab');
        ab.addEventListener ('click', writeAccel(), true);
        
        //Aktuell ausgelesene Beschleunigung aus dem Beschleunigungssensor
        var accelx = 0.0;
        var accely = 0.0;
        var x = 0.0;
        var y = 0.0;
        var z = 0.0;
        writeAccel();



        function writeAccel() {
            accelx = accelx * 9;
            accelx = Math.round(accelx);
            accely = accely * 9;
            accely = Math.round(accely);
            document.getElementById("accelx").innerHTML = accelx;
            document.getElementById("accely").innerHTML = accely;
            x = Math.round(x);
            y = Math.round(y);
            z = Math.round(z);
            document.getElementById("x").innerHTML = x;
            document.getElementById("y").innerHTML = y;
            document.getElementById("z").innerHTML = z;
        }


        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', function(event) {
                x = event.acceleration.x;
                y = event.acceleration.y;
                z = event.acceleration.z;
            });
        }

        //Ermittelt die Beschleunigung entsprechend der Bildschirmorientierung
        if (window.DeviceOrientationEvent) {
            window.addEventListener("devicemotion", function (event) {
                switch (window.orientation) {
                    case 0:
                        accelx = event.accelerationIncludingGravity.x * (-1);
                        accely = event.accelerationIncludingGravity.y * (-1);
                        writeAccel();
                        break;

                    case -90:
                        accelx = event.accelerationIncludingGravity.y * (-1);
                        accely = event.accelerationIncludingGravity.x;
                        writeAccel();
                        break;

                    case 90:
                        accelx = event.accelerationIncludingGravity.y;
                        accely = event.accelerationIncludingGravity.x * (-1);
                        writeAccel();
                        break;

                    case 180:
                        accelx = event.accelerationIncludingGravity.x;
                        accely = event.accelerationIncludingGravity.y;
                        writeAccel();
                        break;
                }
            }, true);
        } else {
            alert("Sorry, ihr Gerät unterstützt keine Bildschirmorientierung!");
        }




/*function Quadrat() {
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
los.addEventListener ('click', create_array, true);*/