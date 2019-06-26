//Aktuelle ausgelesene Werte aus den Beschleunigungssensoren
var timestamp_speed = 0.0;
var sum_accel_speed = 0.0;

//Schlagzahl
var stroke = 20;


//Array welches die 10 exakten Werte speichert
var exact_array = [];
//Counter an welcher Stelle im Array gerade der aktuellste Wert steht
var exact_counter = 0;

//Array welches die letzten 1000 gemittelten Werte speichert
var averaged_array = [];
//Counter an welcher Stelle im Array gerade der aktuellste Wert steht
var averaged_counter = 0;

//Array welches die letzen 5 Hochpunkte sammelt
var maximum_points = [];


//Sekunden, wie oft die Tabelle befüllt wird
var sec = 0.01;

//Funktionsaufrufe
fill_exact_array();
fill_averaged_array();
fill_maximum_points();
write_stroke();
create_array();


//schreibt die aktuell ausgelesenen Werte auf den Bildschirm
function write_stroke() {
    document.getElementById("stroke").innerHTML = stroke;
}

//Ermittelt die Beschleunigung entsprechend der Bildschirmbeschleunigung
if (window.DeviceMotionEvent) {
    if (!Date.now) {
        Date.now = function () { return new Date().getTime(); }
    }
    window.addEventListener('devicemotion', function (event) {
        timestamp_speed = Date.now();
        var accel_speed_x = event.acceleration.x;
        var accel_speed_y = event.acceleration.y;
        var accel_speed_z = event.acceleration.z;
        sum_accel_speed = accel_speed_x + accel_speed_y + accel_speed_z;
    });
}

//füllt exact_array mit 10 Strings
function fill_exact_array() {
	for (let x = 1; x <= 10; x++) {
		positions.push(["exact" + x, "date" + x]);
	}
}

//füllt averaged_array mit 1000 Strings
function fill_averaged_array() {
	for (let x = 1; x <= 1000; x++) {
		positions.push(["averaged" + x, "date" + x]);
	}
}

//füllt maximum_points mit 6 Strings
function fill_averaged_array() {
	for (let x = 1; x <= 6; x++) {
		positions.push(["max" + x]);
	}
}

//Erneuert alle <sec> Sekunden die Arrays
function create_array() {
    exact_array[exact_counter][0] = sum_accel_speed;
    exact_array[exact_counter][1] = timestamp_speed;

    averaged_array[averaged_counter][0] = averaged_value();
    averaged_array[averaged_counter][1] = exact_array[exact_counter][1];

    find_maximum_point();

    //Counter hoch setzen. Läuft er aus dem Array raus, wird er zu 0
    if (exact_counter < 999) {
        exact_counter++;
    } else {
        exact_counter = 0;
    }

    if(averaged_counter < 9) {
        averaged_counter++;
    } else {
        averaged_counter = 0;
    }

    //Methode alle <sec> Sekunden wiederholen
    setTimeout(create_array, sec * 1000);
}

//mittelt die letzen 10 exakten Werte
function averaged_value() {
    let total_accel_speed = 0;
    for(let x = 0; x < 10; x++) {
        total_accel_speed += exact_array[x][0];
    }
    return total_accel_speed / 10;
}

//ermittelt den vermutlichen Hochpunkt der Kurve und schreibt ihn in maximum_points
function find_maximum_point() {
    let counter_2 = averaged_counter;
    let counter_1 = counter_2 - 1;
    let counter_0 = counter_2 - 2;
    if (counter_1 < 0) {
        counter_1 = 999;
    } else if (counter_0 < 0) {
        counter_0 = 999;
    }
    if (averaged_array[counter_1][0] > averaged_array[counter_0][0]
        && averaged_array[counter_1][0] > averaged_array[counter_2][0]
        && averaged_array[counter_0][0] > 2
        && averaged_array[counter_1][0] > 2
        && averaged_array[counter_2][0] > 2) {
        set_maximum_point(counter_1);
        set_stroke();
        write_stroke();
    }
}

//Erneuert die Tabelle mit den Hochpunkten
function set_maximum_point(counter) {
    for (let x = 5; x > 0; x--) {
        maximum_points[x + 1] = maximum_points[x];
    }
    maximum_points[0] = averaged_array[counter][1];
}

//Errechnet die neue Schlagzahl
function set_stroke() {
    let total_stroke = 0;
    for (let x = 5; x > 0; x--) {
        total_stroke += (maximum_points[0] - maximum_points[x]);
    }
    let time_per_stroke = total_stroke / 5;
    stroke = Math.floor(60000 / time_per_stroke);
}