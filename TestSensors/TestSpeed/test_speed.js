// Array with the two positions
var positions = [];
positions.push(["lat1", "lon1", "date1"]);
positions.push(["lat2", "lon2", "date2"]);
positions.push(["lat3", "lon3", "date3"]);
positions.push(["lat4", "lon4", "date4"]);
var splitdate = new Array("year", "month", "day", "hour", "min", "sec", "milsec");
var speed_per_500m = new Array("mins", "secs");
var speed_per_500m_10 = new Array("minss", "secss");
var longitude = 0;
var latitude = 0;

var timezone = 1;

//Funktionsaufrufe
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

	document.getElementById("minss").innerHTML = speed_per_500m_10[0];
	document.getElementById("secss").innerHTML = speed_per_500m_10[1];
}


function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.watchPosition(handle_position);
	}
	handleSpeedValues();
}

function handle_position(position) {
	latitude = position.coords.latitude;
	longitude = position.coords.longitude;
}

function handleSpeedValues() {
	writePosition();
	writeDate();
	writeTimePer500m();
	writeTimePer500m10();
	outputValues();
	setTimeout(handleSpeedValues, 3 * 1000);
}

function writePosition() {
	positions[2][0] = positions[3][0];
	positions[2][1] = positions[3][1];
	positions[3][0] = positions[0][0];
	positions[3][1] = positions[0][1];
	
	positions[0][0] = positions[1][0];
	positions[0][1] = positions[1][1];
	positions[1][0] = latitude;
	positions[1][1] = longitude;
}

function writeDate() {
	if (!Date.now) {
		Date.now = function () { return new Date().getTime(); }
	}
	let date = Date.now();
	positions[2][2] = positions[3][2];
	positions[3][2] = positions[0][2];
	
	positions[0][2] = positions[1][2];
	positions[1][2] = date;
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
	splitdate[3] = date % 24;
	date = date - splitdate[3];
	date = date / 24;
	splitdate[3] = splitdate[3] + timezone;
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

function writeTimePer500m() {
	let speed = speedInMeterPerSeconds();
	if (speed == 0) {
		speed_per_500m[1] = 0;
		speed_per_500m[0] = 0;
		return 0;
	} else {
		let seconds_per_500m = 500 / speed;
		speed_per_500m[1] = seconds_per_500m % 60;
		speed_per_500m[0] = (seconds_per_500m - speed_per_500m[1]) / 60;
		speed_per_500m[1] = Math.round(speed_per_500m[1]);
		
		// Seconds need for 500m
		return seconds_per_500m;
	}
}

function speedInMeterPerSeconds() {
	let meter = distanceOnGeoidInMetres();
//	alert("meter: " + meter + "  date1: " + positions[0][2] + "  date2: " + positions[1][2] + "  lat1: " + positions[0][0] + "  lon1: " + positions[0][1] + "  lat2: " + positions[1][0] + "  lon2: " + positions[1][1]);
	if (isNaN(positions[0][2] || positions[1][2])) {
		return 0;
	} else {
		let seconds = positions[1][2] - positions[0][2];
		seconds = Math.floor(seconds / 1000);

		// Speed in Metres per Second
		return meter / seconds;
	}
}

function distanceOnGeoidInMetres() {
	let lat1 = positions[0][0];
	let lon1 = positions[0][1];
	let lat2 = positions[1][0];
	let lon2 = positions[1][1];

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

function writeTimePer500m10() {
	let speed = speedInMeterPerSeconds10();
	if (speed == 0) {
		speed_per_500m_10[1] = 0;
		speed_per_500m_10[0] = 0;
		return 0;
	} else {
		let seconds_per_500m = 500 / speed;
		speed_per_500m_10[1] = seconds_per_500m % 60;
		speed_per_500m_10[0] = (seconds_per_500m - speed_per_500m_10[1]) / 60;
		speed_per_500m_10[1] = Math.round(speed_per_500m_10[1]);

		// Seconds need for 500m
		return seconds_per_500m;
	}
}

function speedInMeterPerSeconds10() {
	let meter = distanceOnGeoidInMetres10();
//	alert("meter: " + meter + "  date1: " + positions[0][2] + "  date2: " + positions[1][2] + "  lat1: " + positions[0][0] + "  lon1: " + positions[0][1] + "  lat2: " + positions[1][0] + "  lon2: " + positions[1][1]);
	if (isNaN(positions[2][2] || positions[1][2])) {
		return 0;
	} else {
		let seconds = positions[1][2] - positions[2][2];
		seconds = Math.floor(seconds / 1000);

		// Speed in Metres per Second
		return meter / seconds;
	}
}

function distanceOnGeoidInMetres10() {
	let lat1 = positions[2][0];
	let lon1 = positions[2][1];
	let lat2 = positions[1][0];
	let lon2 = positions[1][1];

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