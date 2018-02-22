// import { Component, Directive, Input, OnInit } from '@angular/core';
// import { forEach } from '@angular/router/src/utils/collection';
// import { DataService } from '../core/services/data.service';
// import { Response } from '@angular/http/src/static_response';
// declare var google: any;
// @Component({
//     selector: 'app-map',
//     templateUrl: './map.component.html',
//     styleUrls: ['./map.component.css']
// })
// export class MapBakComponent implements OnInit {
//     coodrs: any;
//     startpoint: any;
//     markerList = [];
//     searchedPoints = [];
//     distance: number = 0.5; //km
//     countDone: number = 0;
//     accDPs: number = 4;
//     searchPointsmax: number;
//     directionsDisplay: any;
//     directionsService: any;
//     polyroadroutes = [];
//     drivePolyPoints = [];
//     drivePolygons = [];
//     drivePolygon: any;
//     routeMarkers = [];
//     startPointAddress: string;
//     int_ds: number = 0;
//     ds = [];
//     geocoder: any;
//     percentageinterpolate: number = 0.8;
//     map: any;
//     constructor(private dataService: DataService) {
//     }

//     public ngOnInit() {
//         this.initMap();
//     }

//     initMap() {
//         this.dataService.get("http://localhost:51375/api/map").subscribe((res: Response) => {
//             console.log(res);
//             this.coodrs = res;
//             if (this.coodrs.length > 0) {
//                 this.startpoint = new google.maps.LatLng(this.coodrs[2].lat, this.coodrs[2].lng);
//                 this.distance = this.coodrs[2].distance;
//                 this.directionsService = new google.maps.DirectionsService();
//                 this.directionsDisplay = new google.maps.DirectionsRenderer();

//                 this.map = new google.maps.Map(document.getElementById('gmap'), {
//                     zoom: 18,
//                     center: this.startpoint,
//                 });
//                 this.geocoder = new google.maps.Geocoder();
//                 this.directionsDisplay = new google.maps.DirectionsRenderer();
//                 this.directionsDisplay.setMap(this.map);
//                 this.PointsInArea();
//             } else {
//                 console.log("error! no data!");
//             }
//         }, error => console.log(error));
//     }
//     drawLine(map, color, flightPlanCoordinates) {
//         var flightPath = new google.maps.Polyline({
//             path: flightPlanCoordinates,
//             geodesic: true,
//             strokeColor: color,
//             strokeOpacity: 0.5,
//             strokeWeight: 5
//         });
//         this.markerList.push(this.createMaker(map, flightPlanCoordinates));
//         flightPath.setMap(map);
//         return flightPath;
//     }
//     createMaker(text, latlng) {
//         var marker = new google.maps.Marker({
//             position: latlng,
//             map: this.map,
//             title: text
//         });
//         return marker;
//     }
//     getGeoNameFromLatLng(latLng) {
//         var resultAddress: string;
//         var mother = this;
//         this.geocoder.geocode({ 'location': latLng }, function (results, status) {
//             if (status === 'OK') {
//                 if (results[0]) {
//                     var tempAddress = results[0].formatted_address;
//                     // map.setZoom(11);
//                     console.log(tempAddress);
//                     if (tempAddress == mother.startpoint['location']) {
//                         var point = new google.maps.LatLng(latLng.lat(), latLng.lng());
//                         mother.searchedPoints.push(point);
//                         // mother.placeoutsidemarker(point);
//                     }
//                     mother.getPointSameRoad(false);
//                     // var marker = new google.maps.Marker({
//                     //     position: latLng,
//                     //     map: map
//                     // });
//                     // infowindow.setContent(results[0].formatted_address);
//                     // infowindow.open(map, marker);
//                 } else if (status === 'OVER_QUERY_LIMIT') {
//                     setTimeout(() => {
//                         mother.getPointSameRoad(latLng);
//                     }, 4000);
//                 }
//                 else {
//                     console.log('No results found');
//                 }
//             } else {
//                 // console.log('Geocoder failed due to: ' + status);
//                 setTimeout(() => {
//                     mother.getPointSameRoad(latLng);
//                 }, 4000);
//             }
//         });

//     }
//     PointsInArea() {
//         this.countDone = 0;
//         this.int_ds = 0;

//         let str: string = `Start Point (lat: ${this.startpoint.lat()}, lng: ${this.startpoint.lng()})`;
//         this.startpoint['text'] = str;
//         //this.createMaker(str, this.startpoint);
//         var mother = this;
//         this.geocoder.geocode({
//             'latLng': this.startpoint
//         }, function (results, status) {
//             if (status == google.maps.GeocoderStatus.OK) {
//                 if (results[1]) {
//                     mother.startpoint['location'] = results[1].formatted_address;
//                     var marker = mother.placeMarker(mother.startpoint, results[1].formatted_address, true);
//                 } else {
//                     //alert('No results found');
//                     mother.placeMarker(mother.startpoint, '', true);
//                 }
//             } else {
//                 //alert('Geocoder failed due to: ' + status);
//                 mother.placeMarker(mother.startpoint, '', true);
//             }
//         });
//         this.searchedPoints = this.getCirclePoints(this.startpoint, this.distance);
//         //For time based....
//         //searchPoints = getCirclePoints(pt,(80*(timeToDrive/60)));	//120kmph * (time /60/60)

//         //this.getPointSameRoad(false);
//         this.getDirections(false);
//         this.searchPointsmax = this.searchedPoints.length;
//         this.drivePolyPoints = Array();
//     }
//     getCirclePoints(center, radius) {
//         var circlePoints = Array();
//         var searchPoints = Array();
//         //var rLat = (radius/3963.189) * (180/PI); // miles
//         var rLat = (radius / 6378.135) * (180 / Math.PI); // km	
//         var rLng = rLat / Math.cos(center.lat() * (Math.PI / 180));
//         //this.getGeoNameFromLatLng(map, center, true);
//         for (var a = 0; a < 361; a++) {
//             var aRad = a * (Math.PI / 180);
//             var x = center.lng() + (rLng * Math.cos(aRad));
//             var y = center.lat() + (rLat * Math.sin(aRad));
//             var point = new google.maps.LatLng(parseFloat(y), parseFloat(x));

//             circlePoints.push(point);
//             if (a % 5 == 0) {
//                 searchPoints.push(point);
//             }
//         }

//         //searchPoints.reverse();
//         searchPoints = this.shuffleArray(searchPoints);
//         return searchPoints;
//     }

//     getPointSameRoad(point) {
//         if (point) {
//             var backpoint = new google.maps.LatLng(parseFloat(point.lat), parseFloat(point.lng));
//             //console.log("searchPoints.push");
//             this.searchedPoints.push(backpoint);
//         }
//         if (!this.searchedPoints.length) {
//             this.countDone += 1;
//             //console.log("countDone="+countDone+"("+searchPointsmax+")");
//             document.getElementById("wait").innerHTML = "<p><font color='#FF0000'>Finished get geo location!</font></p>";
//             this.getDirections(false);
//             return;
//         } else {
//             var percent = Math.round(100 - ((this.searchedPoints.length / this.searchPointsmax) * 100));
//             document.getElementById("wait").innerHTML = "<p><font color='#FF0000'>Processing get geo location " + percent + "%</font></p>";
//         }
//         var thispoint = this.searchedPoints[0];

//         this.searchedPoints.shift();
//         var mother = this;
//         setTimeout(() => {
//             mother.getGeoNameFromLatLng(thispoint);
//         }, 1000);
//     }

//     getDirections(point) {
//         //if there is a point to put back on to searchPoints...
//         if (point) {
//             this.searchedPoints.push(point);
//         }
//         //if there are no more points to process...
//         if (!this.searchedPoints.length) {
//             this.countDone += 1;
//             //console.log("countDone="+countDone+"("+searchPointsmax+")");
//             document.getElementById("wait").innerHTML = "<p><font color='#FF0000'>Finished!</font></p>";
//             return;
//         } else {
//             var percent = Math.round(100 - ((this.searchedPoints.length / this.searchPointsmax) * 100));
//             document.getElementById("wait").innerHTML = "<p><font color='#FF0000'>Processing " + percent + "%</font></p>";
//         }

//         var from = this.startpoint.lat().toFixed(this.accDPs) + ' ' + this.startpoint.lng().toFixed(this.accDPs);
//         var to = this.searchedPoints[0].lat().toFixed(this.accDPs) + ' ' + this.searchedPoints[0].lng().toFixed(this.accDPs);
//         this.directionsDisplay.setMap(this.map);
//         var request = {
//             origin: from,
//             destination: to,
//             travelMode: 'DRIVING'
//         };
//         var thispoint = this.searchedPoints[0];
//         //remove point from stack
//         this.searchedPoints.shift();
//         //console.log(to+"|"+from+"|"+distToDrive);
//         //console.log(localStorage.getItem(to+"|"+from+"|"+distToDrive));
//         var mother = this;
//         if (typeof (Storage) !== "undefined") {
//             if (sessionStorage.getItem(to + "|" + from + "|" + this.distance)) {
//                 console.log("Found Report");
//                 this.directionsearch(sessionStorage.getItem(to + "|" + from + "|" + this.distance), google.maps.DirectionsStatus.OK, from, to, false, thispoint);
//             } else {
//                 setTimeout(() => {
//                     this.directionsService.route(request, function (response, status, thispoint) {
//                         mother.directionsearch(response, status, from, to, true, thispoint);
//                     });
//                 }, 200);
//             }

//         } else {
//             console.log("No Report");
//             setTimeout(() => {
//                 this.directionsService.route(request, function (response, status, thispoint) {
//                     mother.directionsearch(response, status, from, to, true, thispoint);
//                 });
//             }, 200);
//         }
//     }
//     directionsearch(response, status, from, to, store, point) {
//         //console.log("directionsearch status="+status);
//         var mother = this;
//         if (status == google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
//             console.log("OVER_QUERY_LIMIT");
//             setTimeout(() => {
//                 mother.getDirections(point);
//             }, 4000);
//             //console.log("OVER_QUERY_LIMIT End");	
//         } else {
//             if (status == google.maps.DirectionsStatus.OK) {
//                 //var distance = parseInt(response.routes[0].legs[0].distance.value / 1609);
//                 //var duration = parseFloat(response.routes[0].legs[0].duration.value / 3600).toFixed(2);
//                 //console.log(response);

//                 var route_latlngs;

//                 if (response.routes) {
//                     route_latlngs = response.routes[0].overview_path;
//                 } else {
//                     // route_latlngs = JSON.parse(response.split("|")[0]);
//                     route_latlngs = JSON.parse(response);
//                     // console.log(route_latlngs);
//                 }

//                 //console.log(response.routes[0].legs[0].steps);

//                 if (store) {
//                     console.log("Store");
//                     setTimeout(() => {
//                         mother.shortenAndShow(route_latlngs, to, from, true);
//                     }, 1500);
//                     //setTimeout(function() { shortenAndShowWTime(response.routes[0].legs[0].steps, route_latlngs); }, 1500);
//                 } else {
//                     mother.shortenAndShow(route_latlngs, to, from, false);
//                     //shortenAndShowWTime(response.routes[0].legs[0].steps, route_latlngs);
//                 }
//             } else {
//                 if (status == "NOT_FOUND" || status == "ZERO_RESULTS") {
//                     console.log("Route NOT_FOUND, so shortenAndTryAgain");
//                     setTimeout(() => {
//                         mother.shortenAndTryAgain();
//                     }, 500);
//                 }
//             }
//         }
//     }
//     shortenAndTryAgain() {
//         //bring it closer and try
//         if (this.searchedPoints[0]) {
//             var startpoint = new google.maps.LatLng(this.startpoint.lat(), this.startpoint.lng());
//             var endPoint = new google.maps.LatLng(this.searchedPoints[0].lat(), this.searchedPoints[0].lng());
//             var middlePoint = new google.maps.geometry.spherical.interpolate(startpoint, endPoint, this.percentageinterpolate);

//             //console.log("getDirections with midpoint : " +middlePoint);
//             this.getDirections(middlePoint);
//         } else {
//             //console.log("getDirections false");
//             this.getDirections(false);
//         }
//     }

//     shortenAndShow(overview_pathlatlngs, to, from, boolStore) {
//         var distToDrivekm = this.distance * 1000;
//         var dist = 0;
//         var cutoffIndex = 0;
//         var perimeterPoints = Array();

//         var boolCrossedThreshold = false;

//         //loop through each leg of the route
//         for (var n = 0; n < overview_pathlatlngs.length - 1; n++) {

//             var alat = overview_pathlatlngs[n].lat;
//             if (typeof alat !== "number") {
//                 alat = overview_pathlatlngs[n].lat();
//             }

//             var alng = overview_pathlatlngs[n].lng;
//             if (typeof alng !== "number") {
//                 alng = overview_pathlatlngs[n].lng();
//             }

//             var blat = overview_pathlatlngs[n + 1].lat;
//             if (typeof blat !== "number") {
//                 blat = overview_pathlatlngs[n + 1].lat();
//             }

//             var blng = overview_pathlatlngs[n + 1].lng;
//             if (typeof blng !== "number") {
//                 blng = overview_pathlatlngs[n + 1].lng();
//             }


//             var pointA = new google.maps.LatLng(alat, alng);
//             var pointB = new google.maps.LatLng(blat, blng);

//             //add this this leg distance to running total (dist)
//             dist += google.maps.geometry.spherical.computeDistanceBetween(pointA, pointB);

//             //if running total is less than threshold
//             if (dist < distToDrivekm) {
//                 //Add to perimeterPoints
//                 perimeterPoints.push(pointA);
//             } else {
//                 boolCrossedThreshold = true
//                 break; // exit loop
//             }
//         }

//         //console.log("boolCrossedThreshold="+boolCrossedThreshold);

//         var lastPoint = perimeterPoints[perimeterPoints.length - 1];
//         var mother = this;
//         this.geocoder.geocode({ 'latLng': lastPoint }, function (results, status) {
//             if (status === 'OK') {
//                 if (results[0]) {
//                     var tempAddress = results[1].formatted_address;
//                     if (tempAddress != mother.startpoint['location']) {
//                         // mother.placeoutsidemarker(point);
//                         console.log(tempAddress);
//                         var polyroadroute = new google.maps.Polyline({
//                             path: perimeterPoints,
//                             geodesic: true,
//                             strokeColor: '#FF0000',
//                             strokeOpacity: 1.0,
//                             strokeWeight: 5
//                         });
//                         //show the road route?
//                         polyroadroute.setMap(mother.map);
//                         //add to the array of road routes
//                         mother.polyroadroutes.push(polyroadroute);
//                         mother.addBorderMarker(lastPoint, dist);
//                     }
//                 }
//             }
//         });
//         // var polyroadroute = new google.maps.Polyline({
//         //     path: perimeterPoints,
//         //     geodesic: true,
//         //     strokeColor: '#FF0000',
//         //     strokeOpacity: 1.0,
//         //     strokeWeight: 5
//         // });
//         // //show the road route?
//         // polyroadroute.setMap(this.map);
//         // //add to the array of road routes
//         // this.polyroadroutes.push(polyroadroute);
//         // this.addBorderMarker(lastPoint, dist);
//         // //placePoints.push(lastPoint);

//         //setTimeout("getDirections(false)", 50 );	//Add some delay
//         this.getDirections(false);
//     }
//     addBorderMarker(pt, d) {
//         this.ds.push(d);

//         var pointstring = pt.lat() + "," + pt.lng();
//         var mother = this;
//         this.geocoder.geocode({
//             'latLng': pt
//         }, function (results, status) {
//             if (status == google.maps.GeocoderStatus.OK) {
//                 if (results[1]) {
//                     var marker = mother.placeMarker(pt, results[1].formatted_address, false);
//                     mother.routeMarkers.push(marker);

//                 } else {
//                     //alert('No results found');
//                     mother.placeMarker(pt, '', false);
//                     mother.routeMarkers.push(marker);
//                 }
//             } else {
//                 //alert('Geocoder failed due to: ' + status);
//                 mother.placeMarker(pt, '', false);
//                 mother.routeMarkers.push(marker);
//             }
//         });
//     }
//     sortPoints2Polygon() {
//         var points = [];
//         var bounds = new google.maps.LatLngBounds();

//         for (var i = 0; i < this.drivePolyPoints.length; i++) {


//             var alat = this.drivePolyPoints[i].lat();
//             var alng = this.drivePolyPoints[i].lng();


//             var pointA = new google.maps.LatLng(alat, alng);

//             points.push(pointA);
//             bounds.extend(pointA);

//         }

//         var center = bounds.getCenter();
//         var bearing = [];

//         for (var i = 0; i < points.length; i++) {
//             points[i].bearing = google.maps.geometry.spherical.computeHeading(center, points[i]);
//         }

//         points.sort(this.bearingsort);

//         // FMTkmlcoordinates = "";
//         // for (var i = 0; i < points.length; i++) {
//         //     FMTkmlcoordinates += points[i].lng() + "," + points[i].lat() + ",0 ";
//         // }

//         // FMTkmlcoordinates += points[0].lng() + "," + points[0].lat() + ",0 "; //Fix issue with unclosed polygon

//         this.drivePolyPoints = points;
//     }
//     bearingsort(a, b) {
//         return (a.bearing - b.bearing);
//     }
//     placeMarker(location, text, isstartpoint) {
//         //console.log(location);
//         var routePoints = new Array(0);
//         routePoints.push(location);
//         routePoints.push(this.startpoint);

//         var d_D_AS_CF: number = this.finddistance(routePoints);
//         console.log(d_D_AS_CF);
//         var d = this.ds[this.int_ds];
//         var str = 'Distance by road: ' + (d / 1000).toFixed(2) + ' km' + ' - Distance as the crow flies : ' + d_D_AS_CF + ' km )';

//         if (!isstartpoint) {
//             text = text + ' | ' + str;
//         }

//         var marker = new google.maps.Marker({
//             position: location,
//             map: this.map,
//             title: text,
//             draggable: false,
//             opacity: 0.35
//         });

//         return marker;
//     }
//     finddistance(route) {
//         var dist = 0;
//         dist = google.maps.geometry.spherical.computeLength(route);

//         dist = dist / 1000;
//         return dist;
//     }
//     shuffleArray(array) {
//         for (var i = array.length - 1; i > 0; i--) {
//             var j = Math.floor(Math.random() * (i + 1));
//             var temp = array[i];
//             array[i] = array[j];
//             array[j] = temp;
//         }
//         return array;
//     }
//     placeoutsidemarker(myLatlng) {
//         var marker = new google.maps.Marker({
//             position: myLatlng,
//             map: this.map,
//         });
//     }
// }

// interface Coodr {
//     lat: number;
//     lng: number;
//     distance: number;
// }