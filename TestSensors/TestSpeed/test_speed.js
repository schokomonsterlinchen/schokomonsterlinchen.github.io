// Array with the two positions
var positions = [];
var splitdate = new Array("year", "month", "day", "hour", "min", "sec", "milsec");
var speed_per_500m = new Array("mins", "secs");
//var speed_per_500m_10 = new Array("minss", "secss");

var timezone = 1; //Deutschland = 1 
var yeartime = 1; //Winterzeit = 0, Sommerzeit = 1
var strokesAreAverage = 25;

//Funktionsaufrufe
fillpositions();
outputValues();
getLocation();

//schreibt die aktuell ausgelesenen Werte auf den Bildschirm
function outputValues() {
	document.getElementById("lat1").innerHTML = positions[0][0];
	document.getElementById("lon1").innerHTML = positions[0][1];
	document.getElementById("lat2").innerHTML = positions[1][0];
	document.getElementById("lon2").innerHTML = positions[1][1];
	document.getElementById("year").innerHTML = splitdate[0];
	document.getElementById("month").innerHTML = splitdate[1];
	document.getElementById("day").innerHTML = splitdate[2];
	document.getElementById("hour").innerHTML = splitdate[3];
	document.getElementById("min").innerHTML = splitdate[4];
	document.getElementById("sec").innerHTML = splitdate[5];
	document.getElementById("milsec").innerHTML = splitdate[6];
	document.getElementById("mins").innerHTML = speed_per_500m[0];
	document.getElementById("secs").innerHTML = speed_per_500m[1];
}

//füllt Array mit <strokesAreAverage> Strings
function fillpositions() {
	for (let x = 1; x <= strokesAreAverage; x++) {
		positions.push(["lat" + x, "lon" + x, "date" + x]);
	}
}

//ermittelt die Position und ruft handleSpeedValues auf
function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.watchPosition(handleSpeedValues, (error) => console.log(error), { enableHighAccuracy: true, timeout: 20000, maximumAge: 0, distanceFilter: 0 });
	}
}

//erneuert das Positions-Array mit der neuen Position
function handleSpeedValues(position) {
	if (!Date.now) {
		Date.now = function () { return new Date().getTime(); }
	}
	let date = Date.now();
	writePosition(position, date);
	writeDate(date);
	writeTimePer500m();
	outputValues();
}

//verschiebt alle Einträge in positions um eins und schreibt in die 0te Zeile die neueste Position
function writePosition(position, date) {
	for (let x = strokesAreAverage - 1; x > 0; x--) {
		positions[x][0] = positions[x - 1][0];
		positions[x][1] = positions[x - 1][1];
		positions[x][2] = positions[x - 1][2];
	}
	positions[0][0] = position.coords.latitude;
	positions[0][1] = position.coords.longitude;
	positions[0][2] = date;
}

//ermittelt die aktuelle Zeit
function writeDate(date) {
	// Milliseconds
	splitdate[6] = date % 1000;
	date = date - splitdate[6];
	date = date / 1000;
	// Seconds1
	splitdate[5] = date % 60;
	date = date - splitdate[5];
	date = date / 60;
	// Minutes
	splitdate[4] = date % 60;
	date = date - splitdate[4];
	date = date / 60;
	// Hours
	date += timezone + yeartime;
	splitdate[3] = date % 24;
	date = date - splitdate[3];
	date = date / 24;
	// Day
	date += 731; //Anzahl der Tage seit 1968
	splitdate[2] = date % 1461; //Anzahl der Tage seit Beginn des letzten Schaltjahres
	date = date - splitdate[2]; //Anzahl der Tage von 1968 bis Beginn des letzten Schaltjahres
	date = (date / 365.25) + 1; //Anzahl Jahre seit 1968 bis einschließlich letzen Schaltjahr
	let leafyear = 0;
	if (splitdate[2] < 367) {
		leafyear = 1;
	} else {
		let days = splitdate[2] - 366; //Anzahl Tage seit Ende letzen Schaltjahres
		splitdate[2] = (days % 365) + 1; //Tag Nummer in diesem Jahr
		date += ((days - splitdate[2] + 1) / 365) + 1; //Anzahl der Jahre seit 1968
	}
	// Month
	if (splitdate[2] < 32) {
		splitdate[1] = "Januar";
	} else if (splitdate[2] < 60 + leafyear) {
		splitdate[2] = splitdate[2] - 31;
		splitdate[1] = "Februar";
	} else if (splitdate[2] < 91 + leafyear) {
		splitdate[2] = splitdate[2] - 59 + leafyear;
		splitdate[1] = "März";
	} else if (splitdate[2] < 121 + leafyear) {
		splitdate[2] = splitdate[2] - 90 + leafyear;
		splitdate[1] = "April";
	} else if (splitdate[2] < 152 + leafyear) {
		splitdate[2] = splitdate[2] - 120 + leafyear;
		splitdate[1] = "Mai";
	} else if (splitdate[2] < 182 + leafyear) {
		splitdate[2] = splitdate[2] - 151 + leafyear;
		splitdate[1] = "Juni";
	} else if (splitdate[2] < 213 + leafyear) {
		splitdate[2] = splitdate[2] - 181 + leafyear;
		splitdate[1] = "Juli";
	} else if (splitdate[2] < 244 + leafyear) {
		splitdate[2] = splitdate[2] - 212 + leafyear;
		splitdate[1] = "August";
	} else if (splitdate[2] < 274 + leafyear) {
		splitdate[2] = splitdate[2] - 243 + leafyear;
		splitdate[1] = "September";
	} else if (splitdate[2] < 305 + leafyear) {
		splitdate[2] = splitdate[2] - 273 + leafyear;
		splitdate[1] = "Oktober";
	} else if (splitdate[2] < 335 + leafyear) {
		splitdate[2] = splitdate[2] - 304 + leafyear;
		splitdate[1] = "November";
	} else if (splitdate[2] < 366 + leafyear) {
		splitdate[2] = splitdate[2] - 334 + leafyear;
		splitdate[1] = "Dezember";
	}
	// Year
	splitdate[0] = date + 1967; //Anzahl der Jahre seit 1968 + die Jahre davor
}

//rechnet speedInMeterPerSeconds um in Zeit pro 500m
function writeTimePer500m() {
	let speed = speedInMeterPerHour();
	if (speed == 0) {
		speed_per_500m[1] = 0;
		speed_per_500m[0] = 0;
		return 0;
	} else {
		let seconds_per_500m = (500 / speed) * 3600;
		speed_per_500m[1] = seconds_per_500m % 60;
		speed_per_500m[0] = (seconds_per_500m - speed_per_500m[1]) / 60;
		speed_per_500m[1] = Math.round(speed_per_500m[1]);

		// Seconds need for 500m
		return seconds_per_500m;
	}
}

//berechnet die durchschnittliche Geschwindigkeit in Metern pro Stunde
//anhand der aktuellsten Position verglichen mit den letzen 24 ermittelten Positionen
function speedInMeterPerHour() {
	let totalMiliSec = 0;
	let totalMetres = 0;

	//Schleife zur Geschwindigkeitsberechnung von jeweils der aktuellsten und den letzten 24 ermittelten Positionen
	for (let strokes = strokesAreAverage - 1; strokes > 0; strokes--) {
		//berechnet den Abstand zwischen der aktuellsten
		//und der <strokes>ten Position und zähle alle Meter zusammen
		totalMetres += distanceOnGeoidInMetres(strokes);
							//alert("meter: " + meter + "  date1: " + positions[0][2] + "  date2: " + positions[strokesAreAverage -1][2] + "  lat1: " + positions[0][0] + "  lon1: " + positions[0][1] + "  lat2: " + positions[1][0] + "  lon2: " + positions[1][1]);

		//wenn eine der Daten keine Nummer sind, gib 0 zurück
		if (isNaN(positions[0][2]) || isNaN(positions[strokes][2])) {
			return 0;

		//sonst berechne den zeitlichen Abstand zwischen der Ermittlung
		//der aktuellsten und der <strokes>ten Positionen in Milliekunden
		// und zähle alle Millisekunden zusammen
		} else {
			totalMiliSec += positions[0][2] - positions[strokes][2];
		}
	}

	return Math.floor((totalMetres * 1200000) / totalMiliSec);
}

//berechnet die Distanz in Metern zwischen der aktuellen Position und der Position auf Platz <strokes>
function distanceOnGeoidInMetres(strokes) {
	let lat1 = positions[strokes][0];
	let lon1 = positions[strokes][1];
	let lat2 = positions[0][0];
	let lon2 = positions[0][1];

	if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
		return 0;
	}

	// Convert degrees to radians
	lat1 = lat1 * Math.PI / 180.0;
	lon1 = lon1 * Math.PI / 180.0;

	lat2 = lat2 * Math.PI / 180.0;
	lon2 = lon2 * Math.PI / 180.0;

	// radius of earth in metres
	radius = 6378100;

	// P
	var rho1 = radius * Math.cos(lat1);
	var z1 = radius * Math.sin(lat1);
	var x1 = rho1 * Math.cos(lon1);
	var y1 = rho1 * Math.sin(lon1);

	// Q
	var rho2 = radius * Math.cos(lat2);
	var z2 = radius * Math.sin(lat2);
	var x2 = rho2 * Math.cos(lon2);
	var y2 = rho2 * Math.sin(lon2);

	// Dot product
	var dot = (x1 * x2 + y1 * y2 + z1 * z2);
	var cos_theta = dot / (radius * radius);

	var theta = Math.acos(cos_theta);

	// Distance in Metres
	return radius * theta;
}