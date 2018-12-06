// Array with the two positions
var positions = [];
positions.push(["lat1", "lon1", "date1"]);
positions.push(["lat2", "lon2", "date2"]);
var splitdate = new Array("year", "month", "day", "hour", "min", "sec", "milsec");
var speed_per_500m = new Array("mins", "secs");

//Funktionsaufrufe
writePosition();
get_location();

//schreibt die aktuell ausgelesenen Werte auf den Bildschirm
function writePosition() {
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


function get_location() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(handle_position);
	}
	writePosition();
	setTimeout(get_location, 3 * 1000);
}

function handle_position(position) {
	write_date();
	positions[0] = positions[1];
	positions[1][0] = position.coords.latitude;
	positions[1][1] = position.coords.longitude;
}

function write_date() {
	if (!Date.now) {
		Date.now = function () { return new Date().getTime(); }
	}
	let date = Date.now();
	// Milliseconds
	splitdate[6] = date % 1000;
	date = date - splitdate[6];
	date = date / 1000;
	// Seconds
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
	// Day
	splitdate[2] = date % 365;
	date = date - splitdate[2];
	date = date / 365;
	// Month
	if(splitdate[2] < 32) {
		splitdate[1] = 1;
	} else if(splitdate[2] < 60) {
		splitdate[2] = splitdate[2] - 32;
		splitdate[1] = 2;
	} else if(splitdate[2] < 91) {
		splitdate[2] = splitdate[2] - 60;
		splitdate[1] = 3;
	} else if(splitdate[2] < 121) {
		splitdate[2] = splitdate[2] - 91;
		splitdate[1] = 4;
	} else if(splitdate[2] < 152) {
		splitdate[2] = splitdate[2] - 121;
		splitdate[1] = 5;
	} else if(splitdate[2] < 182) {
		splitdate[2] = splitdate[2] - 152;
		splitdate[1] = 6;
	} else if(splitdate[2] < 213) {
		splitdate[2] = splitdate[2] - 182;
		splitdate[1] = 7;
	} else if(splitdate[2] < 244) {
		splitdate[2] = splitdate[2] - 213;
		splitdate[1] = 8;
	} else if(splitdate[2] < 274) {
		splitdate[2] = splitdate[2] - 244;
		splitdate[1] = 9;
	} else if(splitdate[2] < 305) {
		splitdate[2] = splitdate[2] - 274;
		splitdate[1] = 10;
	} else if(splitdate[2] < 335) {
		splitdate[2] = splitdate[2] - 305;
		splitdate[1] = 11;
	} else if(splitdate[2] < 366) {
		splitdate[2] = splitdate[2] - 335;
		splitdate[1] = 12;
	}
	// Year
	splitdate[0] = date;
}

function time_per_500m(speed_in_metres_per_seconds) {
	// Seconds need for 500m
	return 500 / speed_in_metres_per_seconds;
}

function speed_on_distance_and_time(metres, seconds) {
	// Speed in Metres per Second
	return metres / seconds;
}

function distance_on_geoid(lat1, lon1, lat2, lon2) {

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