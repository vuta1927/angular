var accDPs=4;	//Accuracy
var map;
var centerPoint = {lat: 0, lng: 0};
var geocoder;
var zoom = 1;
var centerMarker;
var directionsService;
var directionsDisplay;
var container;
var startpoint;

var routeMarkers=new Array(0);
var centerMarkers=new Array(0);
var drivePolygons=new Array(0);
var polyroadroutes=new Array(0);

var ds;
var int_ds=0;
var int_placePoints=0;
var placePoints = Array();

var autocomplete;
var circlePoints = Array();
var drivePolyPoints = Array();
var searchPolygon,drivePolygon;
var distToDrive; 
var timeToDrive; 
var pointInterval =5;	//Search Accuracy
var FMTkmlcoordinates="";
var div_kmloutput=document.getElementById("div_outputkml");
var div_outputzipcodes=document.getElementById("div_outputzipcodes");
var searchPointsmax;
var percentageinterpolate = 0.8;
var countDone = 0;
var quality_failedqueries=0;

function GUnload() {}	//Keep

function Gload() 
{
	geocoder = new google.maps.Geocoder();
	directionsService = new google.maps.DirectionsService();
	directionsDisplay = new google.maps.DirectionsRenderer();
	
	container = document.getElementById("map_canvas");
	var myOptions = {scaleControl:true,zoom:zoom,center:centerPoint,mapTypeId:google.maps.MapTypeId.ROADMAP,draggableCursor:'crosshair',mapTypeControlOptions:{style:google.maps.MapTypeControlStyle.DROPDOWN_MENU},fullscreenControl: true};
	map = new google.maps.Map(container,myOptions);

	document.getElementById('btn_genkml').disabled=true;
	document.getElementById('btn_genkml2').disabled=true;
	document.getElementById('btn_genkml3').disabled=true;
	
	directionsDisplay = new google.maps.DirectionsRenderer();
	directionsDisplay.setMap(map);
	
	if (document.getElementById('rb_units2').checked)
	{
		rb_units_mph_clicked();
	}
	else
	{
		rb_units_km_clicked();
	}
	
	google.maps.Polygon.prototype.getBounds = function() {
		var bounds = new google.maps.LatLngBounds();
		var paths = this.getPaths();
		var path;        
		for (var i = 0; i < paths.getLength(); i++) {
			path = paths.getAt(i);
			for (var ii = 0; ii < path.getLength(); ii++) {
				bounds.extend(path.getAt(ii));
			}
		}
		return bounds;
	};
	
	
	//	Autocomplete Address Block
	var input =  document.getElementById('goto');
  
	autocomplete = new google.maps.places.Autocomplete(input);
	google.maps.event.addListener(autocomplete, 'place_changed', function() 
	{
		//Dont need to do anything!
		console.log("autocomplete place_changed");
  	});
	//	Autocomplete Address Block
	
	checkforpreloaddata();
}

function ftn_findlocation(loc, callbackFunction) 
{
	var km_or_miles;

	var km_or_miles = (usingkm ? "km" : "miles");
	/*
	if (usingkm)
	{
		km_or_miles="km";
	}
	else
	{
		km_or_miles="miles";
	}
	*/
	
	var highwaysandmarkers="";
	if (document.getElementById('cb_avoid').checked)
	{
		highwaysandmarkers+="&hw=true";
	}
	else
	{
		highwaysandmarkers+="&hw=false";
	}
	
	if (document.getElementById('cb_avoidtoll').checked)
	{
		highwaysandmarkers+="&at=true";
	}
	else
	{
		highwaysandmarkers+="&at=false";
	}
	
	if (document.getElementById('cb_showmarkers').checked)
	{
		highwaysandmarkers+="&m=true";
	}
	else
	{
		highwaysandmarkers+="&m=false";
	}
	
	
	if((document.getElementById("goto").value!="")&&(document.getElementById("dist").value!=""))
	{
		document.getElementById("urloutput").value="https://www.freemaptools.com/how-far-can-i-travel.htm?address="+encodeURI (document.getElementById("goto").value)+"&distance="+document.getElementById("dist").value+"&accuracy="+document.getElementById("ddl_speed").value+"&u="+km_or_miles+highwaysandmarkers+"&mode="+document.getElementById("ddl_mode").value;
	}
	else
	{
		if (document.getElementById("timex").value.indexOf("..") >= 0)
		{
			document.getElementById("wait").innerHTML="<p><font color='#FF0000'>Invalid time format.</font></p>";
			return;
		}
		else
		{
			if((document.getElementById("goto").value!="")&&(document.getElementById("speedslider").value!="")&&(document.getElementById("timex").value!=""))
			{
				document.getElementById("urloutput").value="https://www.freemaptools.com/how-far-can-i-travel.htm?address="+encodeURI(document.getElementById("goto").value)+"&speed="+document.getElementById("speedslider").value+"&time="+document.getElementById("timex").value+"&accuracy="+document.getElementById("ddl_speed").value+"&u="+km_or_miles+highwaysandmarkers+"&mode="+document.getElementById("ddl_mode").value;
			}
		}
	}

	FMTkmlcoordinates="";
	pointInterval=document.getElementById("ddl_speed").value;

	geocoder.geocode( { 'address': loc}, function(results, status) 
	{
		if (status == google.maps.GeocoderStatus.OK) 
		{
			var point = results[0].geometry.location;
			callbackFunction(point);
		}
		else 
		{
			//document.getElementById("wait").innerHTML="<p><font color='#FF0000'>Address not found. Try a different address.</font></p>";
			console.log("Location not found!");
			tryB(loc,callbackFunction);
      	}
   	});
}

function tryB(place,callbackFunction)
{
	console.log("tryB");
	var key="AigJnp2bEweWZARGqN0q9lIw6WxiM3yduVKkt8yBmKArIQ80PjtBxUbJYwNUFZXg";
	$.ajax({
		url: 'https://dev.virtualearth.net/REST/v1/Locations/'+place+'?o=json&key='+key,
		type: "GET",
		dataType: "jsonp",
        jsonp: "jsonp",
		success: function (result) {
			//console.log(result);	
			console.log(result.resourceSets[0].resources[0].geocodePoints[0].coordinates[0]);
			console.log(result.resourceSets[0].resources[0].geocodePoints[0].coordinates[1]);
			
			var point=new google.maps.LatLng(parseFloat(result.resourceSets[0].resources[0].geocodePoints[0].coordinates[0]),parseFloat(result.resourceSets[0].resources[0].geocodePoints[0].coordinates[1]));	
			var resultLat = point.lat;
			var resultLng = point.lng;
			callbackFunction(point);
		},
		error: function (x, y, z) {
		console.log(y);
		}
	});
}

function ftn_locationfound(point)
{
	console.log("ftn_locationfound");
	distToDrive = document.getElementById("dist").value;
	
	ds=Array();
	int_ds=0;
	int_placePoints=0;
 	placePoints = Array();
	
	//if distance is not specified, so using 2B
	if (distToDrive!="")
	{
		console.log("using 2B");
		if (!usingkm)
		{
			distToDrive=distToDrive*1.609344;
			
		}
		ftn_preprocessing(null,point);
	}
	else	//2A
	{
		console.log("using 2A");
		speedslider = document.getElementById("speedslider").value;
		time = document.getElementById("timex").value / 60;
        timeToDrive = document.getElementById("timex").value;
		
		if ((time!="")&&(speedslider!=""))
		{
			distToDrive=speedslider*time;
			if (!usingkm)
			{
				distToDrive=distToDrive*1.609344;
			}
			ftn_preprocessing(null,point);
		}
		else
		{
			document.getElementById("wait").innerHTML="<p><font color='#FF0000'>Error : Insufficient data input.</font></p>";
		}
	}
}

function clearoverlays(){
	//remove any previous overlays	
	if (centerMarkers) 
	{
		for (i in centerMarkers)  
		{
			centerMarkers[i].setMap(null);
		}
	}
	
	if (drivePolygons) 
	{
		for (i in drivePolygons) 
		{
			drivePolygons[i].setMap(null);
		}
	}

	if (polyroadroutes) 
	{
		for (i in polyroadroutes) 
		{
			polyroadroutes[i].setMap(null);
		}
	}
	
	if (routeMarkers) 
	{
		for (i in routeMarkers) 
		{
			routeMarkers[i].setMap(null);
		}
	}

	routeMarkers = Array();
	polyroadroutes = Array();
	centerMarkers = Array();
	drivePolygons = Array();
	
	document.getElementById("wait").innerHTML="";
}

function ftn_preprocessing(ov,pt) 
{
	//05042017
	//sendnotification("how-far-can-i-travel.js ftn_preprocessing","Search Started");
	//05042017
	
	countDone = 0;
	
	startpoint=pt;
	
	if (document.getElementById('cb_showmarkers').checked==true)
	{
		var str="Start Point (" + document.getElementById('goto').value + ")";
		centerMarker = placeMarker(pt,str,true);
		centerMarkers.push(centerMarker);
	}
	
	searchPoints = getCirclePoints(pt,distToDrive);
	
	//For time based....
	//searchPoints = getCirclePoints(pt,(80*(timeToDrive/60)));	//120kmph * (time /60/60)
	
	searchPointsmax=searchPoints.length;
	drivePolyPoints = Array();
	
	getDirections(false);
}

function getCirclePoints(center,radius){
	var circlePoints = Array();
	var searchPoints = Array();

	with (Math) {
		//var rLat = (radius/3963.189) * (180/PI); // miles
		var rLat = (radius/6378.135) * (180/PI); // km	
		var rLng = rLat/cos(center.lat() * (PI/180));
		for (var a = 0 ; a < 361 ; a++ ) {
			var aRad = a*(PI/180);
			var x = center.lng() + (rLng * cos(aRad));
			var y = center.lat() + (rLat * sin(aRad));
			var point = new google.maps.LatLng(parseFloat(y),parseFloat(x));
			circlePoints.push(point);
			if (a % pointInterval == 0) {
				searchPoints.push(point);
				//placeoutsidemarker(point);
			}
		}
	}
	
	
	//searchPoints.reverse();
	searchPoints = shuffleArray(searchPoints);	//randomise

	if (document.getElementById('cb_transparent').checked)
	{
		fillOpacity=0;
	}
	else
	{
		fillOpacity=0.35;
	}

	searchPolygon = new google.maps.Polygon({
		paths: circlePoints,
		strokeColor: '#0000ff',
		strokeOpacity: 1,
		strokeWeight: 1,
		fillColor: document.getElementById("fillcolour").value,
		geodesic: true,
		fillOpacity: fillOpacity,
		clickable: false
	  });

	searchPolygon.setMap(map);	//place search circle on map

	map.fitBounds(searchPolygon.getBounds());	//move map to show
	return searchPoints;
}

function getDirections(point) {
	
	//if there is a point to put back on to searchPoints...
	if (point)
	{
		//console.log("searchPoints.push");
		searchPoints.push(point);
	}
	
	//if there are no more points to process...
	if (!searchPoints.length) {
		countDone+=1;
		//console.log("countDone="+countDone+"("+searchPointsmax+")");
		
		document.getElementById("wait").innerHTML="<p><font color='#FF0000'>Finished!</font></p>";

		map.fitBounds(drivePolygon.getBounds());
	
		searchPolygon.setMap(null);
		document.getElementById('btn_genkml').disabled=false;
		document.getElementById('btn_genkml2').disabled=false;
		document.getElementById('btn_genkml3').disabled=false;
		return;
	}
	else
	{
		var percent=Math.round(100-((searchPoints.length / searchPointsmax)*100));
		document.getElementById("wait").innerHTML="<p><font color='#FF0000'>Processing " +percent+ "%</font></p>";
	}
		
	
	var from = startpoint.lat().toFixed(accDPs) + ' ' + startpoint.lng().toFixed(accDPs);
	var to = searchPoints[0].lat().toFixed(accDPs) + ' ' + searchPoints[0].lng().toFixed(accDPs);
		
	directionsDisplay.setMap(map);
	var selectedMode=document.getElementById("ddl_mode").value;
	
	var request = {origin:from,destination:to,travelMode: google.maps.TravelMode[selectedMode], avoidHighways:document.getElementById('cb_avoid').checked, avoidTolls:document.getElementById('cb_avoidtoll').checked };
	
	var thispoint = searchPoints[0];
	
	//remove point from stack
	searchPoints.shift();
	

//console.log(to+"|"+from+"|"+distToDrive);
	//console.log(localStorage.getItem(to+"|"+from+"|"+distToDrive));
	
	if (typeof(Storage) !== "undefined")
	{
		
		if (sessionStorage.getItem(to+"|"+from+"|"+distToDrive))
		{
			console.log("Found Report");
			directionsearch(sessionStorage.getItem(to+"|"+from+"|"+distToDrive), google.maps.DirectionsStatus.OK, from, to, false,thispoint);
		}
		else{
			setTimeout(function() {
				directionsService.route(request, function(response, status,thispoint){
					directionsearch(response, status, from, to, true,thispoint);
				});
			}, 200);
		}
		
	}	
	else{
		console.log("No Report");
		setTimeout(function() {
			directionsService.route(request, function(response, status,thispoint){
				directionsearch(response, status, from, to, true,thispoint);
			});
		}, 200);
}
}

function placeoutsidemarker(myLatlng)
{
	var marker = new google.maps.Marker({
		position: myLatlng,
		map: map,opacity:FMTmarkeropacity
	});	
}

function directionsearch(response, status, from, to, store, point)
{	
	//console.log("directionsearch status="+status);
	
	if (status == google.maps.DirectionsStatus.OVER_QUERY_LIMIT) 
	{
		console.log("OVER_QUERY_LIMIT");
		setTimeout(function() { getDirections(point); }, 4000);
		//console.log("OVER_QUERY_LIMIT End");	
	}
	else
	{
		if (status == google.maps.DirectionsStatus.OK) 
		{
						//var distance = parseInt(response.routes[0].legs[0].distance.value / 1609);
			//var duration = parseFloat(response.routes[0].legs[0].duration.value / 3600).toFixed(2);
			//console.log(response);
			
			var route_latlngs;
			
			if (response.routes)
			{
				route_latlngs = response.routes[0].overview_path;
			}
			else{
				//route_latlngs = JSON.parse(response.split("|")[0]);
				route_latlngs = JSON.parse(response);
				//console.log(route_latlngs);
			}
			
			//console.log(response.routes[0].legs[0].steps);
			
			if (store)
			{
				console.log("Store");
				setTimeout(function() { shortenAndShow(route_latlngs,to,from,true); }, 1500);
				//setTimeout(function() { shortenAndShowWTime(response.routes[0].legs[0].steps, route_latlngs); }, 1500);
			}
			else{
				shortenAndShow(route_latlngs,to,from,false); 
				//shortenAndShowWTime(response.routes[0].legs[0].steps, route_latlngs);
			}	
		}
		else
		{
			if (status=="NOT_FOUND" || status=="ZERO_RESULTS")
			{
				console.log("Route NOT_FOUND, so shortenAndTryAgain");
				setTimeout(function() { shortenAndTryAgain(); }, 500);
			}
		}
	}
}

function shortenAndTryAgain()
{
	//bring it closer and try
	if (searchPoints[0])
	{
		var startPoint =  new google.maps.LatLng(startpoint.lat(), startpoint.lng()); 
		var endPoint = new google.maps.LatLng(searchPoints[0].lat(),  searchPoints[0].lng());
		var middlePoint = new google.maps.geometry.spherical.interpolate(startPoint, endPoint, percentageinterpolate);
	
		//console.log("getDirections with midpoint : " +middlePoint);
		getDirections(middlePoint);
	}
	else{
		//console.log("getDirections false");
		getDirections(false);
	}		
}

function shortenAndShow(overview_pathlatlngs,to,from,boolStore) 
{
	var distToDrivekm = distToDrive * 1000;
	var dist = 0;
	var cutoffIndex = 0;
	var perimeterPoints = Array();
		
	var boolCrossedThreshold = false;
	
	//loop through each leg of the route
	for (var n = 0 ; n < overview_pathlatlngs.length-1 ; n++ ) {
		
		var alat =  overview_pathlatlngs[n].lat;
		if (typeof alat !== "number")
		{
			alat =  overview_pathlatlngs[n].lat();
		}
		
		var alng =  overview_pathlatlngs[n].lng;
		if (typeof alng !== "number")
		{
			alng =  overview_pathlatlngs[n].lng();
		}
		
		var blat =  overview_pathlatlngs[n+1].lat;
		if (typeof blat !== "number")
		{
			blat =  overview_pathlatlngs[n+1].lat();
		}
		
		var blng =  overview_pathlatlngs[n+1].lng;
		if (typeof blng !== "number")
		{
			blng =  overview_pathlatlngs[n+1].lng();
		}
		

		var pointA = new google.maps.LatLng(alat, alng);
		var pointB = new google.maps.LatLng(blat, blng);
		
		//add this this leg distance to running total (dist)
		dist +=google.maps.geometry.spherical.computeDistanceBetween(pointA,pointB);			
	
		//if running total is less than threshold
		if (dist < distToDrivekm) 
		{
			//Add to perimeterPoints
			perimeterPoints.push(pointA);
		}
		else {
			boolCrossedThreshold = true
			break; // exit loop
		}
	}
	
	//console.log("boolCrossedThreshold="+boolCrossedThreshold);
	
	var lastPoint = perimeterPoints[perimeterPoints.length-1];
	
	var polyroadroute = new google.maps.Polyline({
	  path: perimeterPoints,
	  geodesic: true,
	  strokeColor: '#FF0000',
	  strokeOpacity: 1.0,
	  strokeWeight: 1
	});

	//show the road route?
	if (document.getElementById('cb_showroad').checked)
	{
		polyroadroute.setMap(map);
	}
	
	//add to the array of road routes
	polyroadroutes.push(polyroadroute);
	
	drivePolyPoints.push(lastPoint);

	if (document.getElementById('cb_transparent').checked)
	{
		fillOpacity=0;
	}
	else
	{
		fillOpacity=0.35;
	}
		

	//store
	if (boolStore)
	{
		ftnReport(to,from,distToDrive,perimeterPoints,lastPoint);
	}
	//store
	
	//create drivePolygon when 1 item in array (first time round only)
	if (drivePolyPoints.length == 1) 
	{	
		drivePolygon = new google.maps.Polygon({
			  paths: drivePolyPoints,
			  strokeColor: '#0000ff',
			  strokeOpacity: 0.8,
			  strokeWeight: 1,
			  fillColor: document.getElementById("fillcolour").value,
			  fillOpacity: fillOpacity,
			  clickable: false,
				map: map
			});

		drivePolygons.push(drivePolygon);
	}

	sortPoints2Polygon();
	
	drivePolygon.setPaths(drivePolyPoints);
	
	if (document.getElementById('cb_showmarkers').checked==true)
	{
		addBorderMarker(lastPoint,dist);
	}
	
	placePoints.push(lastPoint);
	
	//setTimeout("getDirections(false)", 50 );	//Add some delay
	getDirections(false);
}



function shortenAndShowWTime(arrSteps,overview_pathlatlngs) 
{
	var distToDrivekm = distToDrive * 1000;
	var timeToDriveSecs = timeToDrive * 60;
	
	console.log(timeToDriveSecs);
	console.log(arrSteps.length + " steps");
	
	
	var timeSecs = 0;
	var dist = 0;
	
	var cutoffIndex = 0;
	var perimeterPoints = Array();
	
	var boolCrossedThreshold = false;
	
	//loop through each leg of the route
	for (var n = 0 ; n < arrSteps.length ; n++ ) {
		
		//console.log("stepn="+n);
		
		
		var alat =  arrSteps[n].end_location.lat;
		if (typeof alat !== "number")
		{
			alat =  arrSteps[n].end_location.lat();
		}
		
		var alng =  arrSteps[n].end_location.lng;
		if (typeof alng !== "number")
		{
			alng =  arrSteps[n].end_location.lng();
		}
		
		var pointA = new google.maps.LatLng(alat, alng);
		
		//console.log("duration(s)="+arrSteps[n].duration.value);
		//console.log("distance(m)="+arrSteps[n].distance.value);
		
		timeSecs+=arrSteps[n].duration.value;
		dist +=arrSteps[n].distance.value;			
	
		//Add to perimeterPoints
		//console.log("timeSecs=" + timeSecs + "("+timeToDriveSecs+")");
		//console.log("dist=" + dist + "("+timeToDriveSecs+")");
		
		//if (dist < distToDrivekm) 
		if (timeSecs < timeToDriveSecs) 
		{
			//console.log("timeSecs=" + timeSecs + "("+timeToDriveSecs+")");
			//console.log("perimeterPoints.push");
			perimeterPoints.push(pointA);
		}
		else {
			boolCrossedThreshold=true
			break;
		}
	}
	
	console.log("timeSecs=" + timeSecs + "("+timeToDriveSecs+")");
	console.log("dist="+ dist);
	
	console.log("boolCrossedThreshold="+boolCrossedThreshold);
	
	
	//return;
	
	var lastPoint = perimeterPoints[perimeterPoints.length-1];
	
	var polyroadroute = new google.maps.Polyline({
	  path: perimeterPoints,
	  geodesic: true,
	  strokeColor: '#FF0000',
	  strokeOpacity: 1.0,
	  strokeWeight: 1
	});

	//show the road route?
	if (document.getElementById('cb_showroad').checked)
	{
		polyroadroute.setMap(map);
	}
	
	//add tot he array of road routes
	polyroadroutes.push(polyroadroute);
	
	drivePolyPoints.push(lastPoint);

	if (document.getElementById('cb_transparent').checked)
	{
		fillOpacity=0;
	}
	else
	{
		fillOpacity=0.35;
	}
		
	
	//create drivePolygon when 1 item in array (first time round only)
	if (drivePolyPoints.length == 1) 
	{	
		console.log(drivePolyPoints);
		drivePolygon = new google.maps.Polygon({
			  paths: drivePolyPoints,
			  strokeColor: '#0000ff',
			  strokeOpacity: 0.8,
			  strokeWeight: 1,
			  fillColor: document.getElementById("fillcolour").value,
			  fillOpacity: fillOpacity,
			  clickable: false,
				map: map
			});

		drivePolygons.push(drivePolygon);
	}

	console.log("sortPoints2Polygon");
	sortPoints2Polygon();
	
	
	drivePolygon.setPaths(drivePolyPoints);
	
	if (document.getElementById('cb_showmarkers').checked==true)
	{
		addBorderMarker(lastPoint,dist);
	}
	
	placePoints.push(lastPoint);
	
	//setTimeout("getDirections(false)", 50 );	//Add some delay
	getDirections(false);
}

function addBorderMarker(pt,d) {
	ds.push(d);
   
	var pointstring=pt.lat()+","+pt.lng();
	
	geocoder.geocode({'latLng': pt}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
			  	if (document.getElementById('cb_showmarkers').checked==true)
				{				
					marker = placeMarker(pt,results[1].formatted_address,false);
					routeMarkers.push(marker);
				}
            } else {
              //alert('No results found');
			  	if (document.getElementById('cb_showmarkers').checked==true)
				{				
					marker = placeMarker(pt,'',false);
					routeMarkers.push(marker);
				}
			  
            }
          } else {
            //alert('Geocoder failed due to: ' + status);
				if (document.getElementById('cb_showmarkers').checked==true)
				{				
					marker = placeMarker(pt,'',false);
					routeMarkers.push(marker);
				}
          }
        });
}












//Needs to stay!
function calctime()
{
	document.getElementById('dist').value='';
}

function finddistance(route)
{
	var distance=0;
	distance=google.maps.geometry.spherical.computeLength(route);
	
	distance=distance/1000;
	return distance.toFixed(2);
}

function genkml()
{
	if (FMTkmlcoordinates!="")
	 {
		div_kmloutput.style.visibility='visible';
		
		MakeKMLfile("Free Map Tools How Far Can I Travel Map","Free Map Tools How Far Can I Travel Map",FMTkmlcoordinates);
	 }
}

function MakeKMLfile(name,description,FMTkmlcoordinates)
{
	var xmlHttp;
	
	try
	{
		// Firefox, Opera 8.0+, Safari
		xmlHttp=new XMLHttpRequest();
	}
	catch (e)
	{
		// Internet Explorer
		try
		{
			xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (e)
		{
			try
			{
				xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (e)
			{
				alert("Your browser does not support AJAX!");
				return false;
			}
		}
	}
	
	xmlHttp.onreadystatechange=function()
	{
		if(xmlHttp.readyState==4)
		{
			SaveToDisk("download/"+xmlHttp.responseText,xmlHttp.responseText) ;
		}
	};
	var randomnumber=Math.floor(Math.random()*9999);

	var params;
	params="rand="+randomnumber;
	params+="&name="+name;
	params+="&description="+description;
	params+="&kmlcoordinates="+FMTkmlcoordinates;
	
	xmlHttp.open("POST","ajax/makekml2.php",true);

	//Send the proper header information along with the request
	xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	xmlHttp.send(params);	
}


function genkml2()
{
	if (FMTkmlcoordinates!="")
	{
		div_kmloutput.style.visibility='visible';
		var pointcoordinates="";
		
		for (x in placePoints)
  		{
			pointcoordinates+="<Placemark><name>"+x+"</name><Point><coordinates>"+placePoints[x].lng()+","+placePoints[x].lat()+",0</coordinates></Point></Placemark>";
  		}
		
		MakeKMLfile2("Free Map Tools How Far Can I Travel Map","Free Map Tools How Far Can I Travel Map",FMTkmlcoordinates,pointcoordinates);
	}
}

function MakeKMLfile2(name,description,FMTkmlcoordinates,pointcoordinates)
{
	var xmlHttp;
	
	try
	{
		// Firefox, Opera 8.0+, Safari
		xmlHttp=new XMLHttpRequest();
	}
	catch (e)
	{
		// Internet Explorer
		try
		{
			xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (e)
		{
			try
			{
				xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (e)
			{
				alert("Your browser does not support AJAX!");
				return false;
			}
		}
	}
	
	xmlHttp.onreadystatechange=function()
	{
		if(xmlHttp.readyState==4)
		{
			SaveToDisk("download/"+xmlHttp.responseText,xmlHttp.responseText);
		}
	};
	var randomnumber=Math.floor(Math.random()*9999);

	var params;
	params="rand="+randomnumber;
	params+="&name="+name;
	params+="&description="+description;
	params+="&kmlcoordinates="+FMTkmlcoordinates;
	params+="&pointcoordinates="+pointcoordinates;
	
	xmlHttp.open("POST","ajax/makekml2.1.php",true);

	//Send the proper header information along with the request
	xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	xmlHttp.send(params);	
}


function SelectAll(id)
{
    document.getElementById(id).focus();
    document.getElementById(id).select();
}

function rb_units_km_clicked()
{
	document.getElementById("span_kphmph1").innerHTML="KPH";
	document.getElementById("span_kphmph2").innerHTML="KPH";
	document.getElementById("span_kmmph").innerHTML="km";
	usingkm=true;
	recheckspeeds();
}

function rb_units_mph_clicked()
{
	 document.getElementById("span_kphmph1").innerHTML="MPH";
	 document.getElementById("span_kphmph2").innerHTML="MPH";
	 document.getElementById("span_kmmph").innerHTML="miles";
	 usingkm=false;
	 recheckspeeds();
}

function recheckspeeds()
{
	if (getRadioValue("modeoftransport") != null)
	{
		var cv=getRadioValue("modeoftransport");
	
		if (cv=="Walking")
		{
			if(usingkm){A_SLIDERS[0].f_setValue(5);}else{A_SLIDERS[0].f_setValue(4)}; 
		}	
		if (cv=="Jogging")
		{
			if(usingkm){A_SLIDERS[0].f_setValue(14.5);}else{A_SLIDERS[0].f_setValue(9)};
		}	
		if (cv=="Running")
		{
			if(usingkm){A_SLIDERS[0].f_setValue(19);}else{A_SLIDERS[0].f_setValue(12)};
		}	
		if (cv=="Cycling")
		{
			if(usingkm){A_SLIDERS[0].f_setValue(40);}else{A_SLIDERS[0].f_setValue(25)}; 
		}	
		if (cv=="Slow Car")
		{
			if(usingkm){A_SLIDERS[0].f_setValue(80);}else{A_SLIDERS[0].f_setValue(50)};
		}	
		if (cv=="Fast Car")
		{
			if(usingkm){A_SLIDERS[0].f_setValue(177);}else{A_SLIDERS[0].f_setValue(110)};
		}	
		calctime();
	}
}

if (document.getElementById("rb_units")=="km")
{
	rb_units_km_clicked();
}
else
{
	rb_units_mph_clicked();
}

function getRadioValue(idOrName) {
	var value = null;
	var element = document.getElementById(idOrName);
	var radioGroupName = null;  
	
	// if null, then the id must be the radio group name
	if (element == null) {
		radioGroupName = idOrName;
	} else {
		radioGroupName = element.name;     
	}
	if (radioGroupName == null) {
		return null;
	}
	var radios = document.getElementsByTagName('input');
	for (var i=0; i<radios.length; i++) {
		var input = radios[ i ];    
		if (input.type == 'radio' && input.name == radioGroupName && input.checked) {                          
			value = input.value;
			break;
		}
	}
	return value;
}

function placeMarker(location,text,isstartpoint) 
{
	//console.log(location);
	
	var image = {url: FMTmarkerurl,size: new google.maps.Size(20, 34),origin: new google.maps.Point(0,0),anchor: new google.maps.Point(10*FMTmarkersizefactor,34*FMTmarkersizefactor), scaledSize: new google.maps.Size(20*FMTmarkersizefactor, 34*FMTmarkersizefactor)};

	var routePoints=new Array(0);
	routePoints.push(location);
	routePoints.push(startpoint);
	
	var d_D_AS_CF=finddistance(routePoints);
	var d=ds[int_ds];
	var str = 'Distance by road: ' + (d/1000).toFixed(2) + ' km (' + (0.621371192*d/1000).toFixed(2) + ' miles)' + ' - Distance as the crow flies : ' + d_D_AS_CF + ' km (' + (d_D_AS_CF*0.621371192).toFixed(2) + ' miles)';
	
	if (!isstartpoint)
	{
		text=text+' | ' +str;
	}
	
	var marker = new google.maps.Marker({position:location,map:map,icon:image,title:text,draggable:false,opacity:FMTmarkeropacity});
	
	return marker;
}




function sortPoints2Polygon() {
points = [];
var bounds = new google.maps.LatLngBounds(); 
     
for (var i=0; i < drivePolyPoints.length; i++) {
	

		var alat =  drivePolyPoints[i].lat();
		var alng =  drivePolyPoints[i].lng();
		
	
		var pointA = new google.maps.LatLng(alat,alng);
	
		points.push(pointA);
		bounds.extend(pointA);
	
}
	
      var center = bounds.getCenter();
      var bearing = [];
	
      for (var i=0; i < points.length; i++) {
        points[i].bearing = google.maps.geometry.spherical.computeHeading(center,points[i]);
      }
	
      points.sort(bearingsort);
	  
		FMTkmlcoordinates="";
		for (var i=0; i < points.length; i++) 
		{
			FMTkmlcoordinates+=points[i].lng() + "," + points[i].lat() + ",0 ";
		}
	
		FMTkmlcoordinates+=points[0].lng() + "," + points[0].lat() + ",0 ";	//Fix issue with unclosed polygon
		
	  drivePolyPoints=points;
}

function bearingsort(a,b) {
  return (a.bearing - b.bearing);
}








function genkml3()
{
	if (FMTkmlcoordinates!="")
	{
		div_kmloutput.style.visibility='visible';
		var pointcoordinates="";
		var roadcoordinates="";
		
		for (x in placePoints)
  		{
			pointcoordinates+="<Placemark><name>"+x+"</name><Point><coordinates>"+placePoints[x].lng()+","+placePoints[x].lat()+",0</coordinates></Point></Placemark>";
  		}
		
		//polyroadroutes
		for (x in polyroadroutes)
  		{
			var routePath_path = polyroadroutes[x].getPath().getArray();
			//console.log(routePath_path.toString());
			
			roadcoordinates += "<Placemark><styleUrl>#msn_ylw-pushpin</styleUrl><LineString><name>Route</name><altitudeMode>relativeToGround</altitudeMode><tessellate>1</tessellate><coordinates>";
			
			for (y in routePath_path)
			{
				//routePath_path[y]; Each Point
				roadcoordinates += routePath_path[y].lng()+','+ routePath_path[y].lat() +',20 ';
			}
			
			roadcoordinates += "</coordinates></LineString></Placemark>";
			
		}
		
		//console.log(roadcoordinates);
		
		MakeKMLfile3("Free Map Tools How Far Can I Travel Map","Free Map Tools How Far Can I Travel Map",FMTkmlcoordinates,pointcoordinates,roadcoordinates);
	}
}

function MakeKMLfile3(name,description,FMTkmlcoordinates,pointcoordinates,roadcoordinates)
{
	var xmlHttp;
	
	try
	{
		// Firefox, Opera 8.0+, Safari
		xmlHttp=new XMLHttpRequest();
	}
	catch (e)
	{
		// Internet Explorer
		try
		{
			xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (e)
		{
			try
			{
				xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (e)
			{
				alert("Your browser does not support AJAX!");
				return false;
			}
		}
	}
	
	xmlHttp.onreadystatechange=function()
	{
		if(xmlHttp.readyState==4)
		{
			SaveToDisk("download/"+xmlHttp.responseText,xmlHttp.responseText);
		}
	};
	var randomnumber=Math.floor(Math.random()*9999);

	var params;
	params="rand="+randomnumber;
	params+="&name="+name;
	params+="&description="+description;
	params+="&kmlcoordinates="+FMTkmlcoordinates;
	params+="&pointcoordinates="+pointcoordinates;
	params+="&roadcoordinates="+roadcoordinates;
	
	xmlHttp.open("POST","ajax/makekml2.2.php",true);

	//Send the proper header information along with the request
	xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	xmlHttp.send(params);	
}




function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function ftnReport(to,from,distToDrive,perimeterPoints,lastPoint)
{	
	console.log("ftnReport");
	if (typeof(Storage) !== "undefined") {
		//sessionStorage.setItem(to+"|"+from+"|"+distToDrive, JSON.stringify(perimeterPoints)+"|"+lastPoint);
		sessionStorage.setItem(to+"|"+from+"|"+distToDrive, JSON.stringify(perimeterPoints));
	}
}