//Initialisieren der Buttons
//Startbutton
var start = document.getElementById('start');
start.addEventListener('click', start_filling_array, true);
//Stoppbutton
var stop = document.getElementById('stop');
stop.addEventListener('click', stop_filling_array, true);
//Downloadbutton
var download = document.getElementById('download');
download.addEventListener('click', download_array, true);

//Aktuell ausgelesene Beschleunigung aus den Sensoren
//Rotationssensor
var timestamp_rotation = 0.0;
var accel_rotate_x = 0.0;
var accel_rotate_y = 0.0;
//Beschleunigungssensor
var timestamp_speed = 0.0;
var accel_speed_x = 0.0;
var accel_speed_y = 0.0;
var accel_speed_z = 0.0;

//Aktuelle Geolocation
var timestamp_geoid = 0.0;
var longitude = 0.0;
var latitude = 0.0;

var tracking = "Tracking is stopped";

//Array, welches mit Werten befüllt wird
var array = [];
array.push(["Timestamp (rotation)", "X-Axis(rotation)", "Y-Axis(rotation)", "Timestamp (speed)", "X-Axis(speed)", "Y-Axis(speed)", "Z-Axis(speed)", "Timestamp (geoid)", "Latitude", "Longitude"]);
//Sekunden, wie oft die Tabelle befüllt wird
var sec = 0.01;
//Zähler der die Array-Zeilen zählt
var count = 0;
//Boolean mit 1 = Array wird befüllt, 0 = Array wird nicht befüllt
var fill_array = 0;

//Funktionsaufrufe
writeAccel();
//create_array();


//schreibt die aktuell ausgelesenen Werte auf den Bildschirm
function writeAccel() {
    let accel_rotate_deg_x = accel_rotate_x * 9;
    let accel_rotate_round_x = Math.round(accel_rotate_deg_x);
    let accel_rotate_deg_y = accel_rotate_y * 9;
    let accel_rotate_round_y = Math.round(accel_rotate_deg_y);
    document.getElementById("accel_rotate_x").innerHTML = accel_rotate_round_x;
    document.getElementById("accel_rotate_y").innerHTML = accel_rotate_round_y;
    accel_speed_round_x = Math.round(accel_speed_x);
    accel_speed_round_y = Math.round(accel_speed_y);
    accel_speed_round_z = Math.round(accel_speed_z);
    document.getElementById("accel_speed_x").innerHTML = accel_speed_round_x;
    document.getElementById("accel_speed_y").innerHTML = accel_speed_round_y;
    document.getElementById("accel_speed_z").innerHTML = accel_speed_round_z;

    document.getElementById("tracking").innerHTML = tracking;
}

//Startet das Befüllen des Arrays
function start_filling_array() {
    fill_array = 1;
    tracking = "Tracking is running";
    create_array();
    writeAccel();
}

//Stoppt das Befüllen des Arrays
function stop_filling_array() {
    fill_array = 0;
    tracking = "Tracking is stopped";
    writeAccel();
}

//Ermittelt die Beschleunigung entsprechend der Bildschirmbeschleunigung
if (window.DeviceMotionEvent) {
    if (!Date.now) {
        Date.now = function () { return new Date().getTime(); }
    }
    window.addEventListener('devicemotion', function (event) {
        timestamp_speed = Date.now();
        accel_speed_x = event.acceleration.x;
        accel_speed_y = event.acceleration.y;
        accel_speed_z = event.acceleration.z;
    });
}

//Ermittelt die Beschleunigung entsprechend der Bildschirmorientierung
if (window.DeviceOrientationEvent) {
    if (!Date.now) {
        Date.now = function () { return new Date().getTime(); }
    } window.addEventListener("devicemotion", function (event) {
        timestamp_rotation = Date.now();
        switch (window.orientation) {
            case 0:
                accel_rotate_x = event.accelerationIncludingGravity.x * (-1);
                accel_rotate_y = event.accelerationIncludingGravity.y * (-1);
                writeAccel();
                break;

            case -90:
                accel_rotate_x = event.accelerationIncludingGravity.y * (-1);
                accel_rotate_y = event.accelerationIncludingGravity.x;
                writeAccel();
                break;

            case 90:
                accel_rotate_x = event.accelerationIncludingGravity.y;
                accel_rotate_y = event.accelerationIncludingGravity.x * (-1);
                writeAccel();
                break;

            case 180:
                accel_rotate_x = event.accelerationIncludingGravity.x;
                accel_rotate_y = event.accelerationIncludingGravity.y;
                writeAccel();
                break;
        }
    }, true);
} else {
    alert("Sorry, ihr Gerät unterstützt keine Bildschirmorientierung!");
}


//Erweitert alle <sec> Sekunden das Array
function create_array() {
    if (fill_array == 1) {
        /*alert("Count = " + count + "  " + array[0][0] + ": " + array[count][0] + "  "
            + array[0][1] + ": " + array[count][1] + "  "
            + array[0][2] + ": " + array[count][2] + "  "
            + array[0][3] + ": " + array[count][3] + "  "
            + array[0][4] + ": " + array[count][4]);*/
        count++;
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(handleGeolocationValues);
        }
        array.push([timestamp_rotation, accel_rotate_x, accel_rotate_y, timestamp_speed, accel_speed_x, accel_speed_y, accel_speed_z, timestamp_geoid, latitude, longitude]);
        setTimeout(create_array, sec * 1000);
    }
}

//Ermittelt den Standort entsprechend der Geolocation
function handleGeolocationValues(position) {
    if (!Date.now) {
        Date.now = function () { return new Date().getTime(); }
    }
    timestamp_geoid = Date.now();

    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
}

//Downloaded das befüllte Array und stellt es zur Verfügung
function download_array() {
    var filename = "testFile";
    let csvContent = convert_csv();
    var text = csvContent;
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

//Konvertiert das befüllte Array in CSV-Format
function convert_csv() {
    let csvContent = "";
    array.forEach(function (rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });
    return csvContent;
}