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
	return r * theta;
}