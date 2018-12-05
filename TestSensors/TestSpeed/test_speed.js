// Array with the two positions
var positions = [];
positions.push(["lat1", "lon1", "date1"]);
positions.push(["lat2", "lon2", "date2"]);
var speed_per_500m = new Array("min", "sec");

//Funktionsaufrufe
writePosition();
get_location();

//schreibt die aktuell ausgelesenen Werte auf den Bildschirm
function writePosition() {
    document.getElementById("lat1").innerHTML = positions[0][0];
    document.getElementById("lon1").innerHTML = positions[0][1];
    document.getElementById("lat2").innerHTML = positions[1][0];
    document.getElementById("lon2").innerHTML = positions[1][1];
    document.getElementById("min").innerHTML = speed_per_500m[0];
    document.getElementById("sec").innerHTML = speed_per_500m[1];
}

function get_location() {
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(handle_position);
	}
	writePosition();
	setTimeout(get_location, 3 * 1000);
}

function handle_position(position) {
	position[0][0] = position[1][0];
	position[0][1] = position[1][1];
	position[1][0] = position.coords.latitude;
	position[1][1] = position.coords.longitude;
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