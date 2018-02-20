import { Component, Directive, Input, OnInit } from '@angular/core';
import { forEach } from '@angular/router/src/utils/collection';
declare var google: any;
@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

    originLocation = { lat: 21.017080, lng: 105.781150 };
    destination = { lat: 21.016267, lng: 105.780063 };
    markerList = [];
    searchedPoints = [];
    distance: number = 0.1; //km
    countDone: number = 0;
    accDPs: number = 4;
    searchPointsmax: number;
    directionsDisplay: any;
    directionsService: any;
    polyroadroutes = [];
    drivePolyPoints = [];
    drivePolygons = [];
    drivePolygon: any;
    routeMarkers = [];
    startPointAddress: string;
    int_ds: number = 0;
    ds = [];
    geocoder: any;
    percentageinterpolate: number = 0.8;
    constructor() {
    }

    public ngOnInit() {
        this.initMap();
    }

    initMap() {
        this.directionsService = new google.maps.DirectionsService();
        this.directionsDisplay = new google.maps.DirectionsRenderer();

        let map = new google.maps.Map(document.getElementById('gmap'), {
            zoom: 18,
            center: this.originLocation,
        });
        this.geocoder = new google.maps.Geocoder();
        this.directionsDisplay = new google.maps.DirectionsRenderer();
        this.directionsDisplay.setMap(map);
        this.PointsInArea(map, this.originLocation);
        // this.drawLine(map, '#FF0000', [this.originLocation, this.destination]);
    }
    drawLine(map, color, flightPlanCoordinates) {
        var flightPath = new google.maps.Polyline({
            path: flightPlanCoordinates,
            geodesic: true,
            strokeColor: color,
            strokeOpacity: 0.5,
            strokeWeight: 5
        });
        this.markerList.push(this.createMaker(map, flightPlanCoordinates));
        flightPath.setMap(map);
        return flightPath;
    }
    createMaker(map, listLatLng) {
        var markerList = []
        listLatLng.forEach(element => {
            var marker = new google.maps.Marker({
                position: element,
                map: map,
                title: element.text
            });
            markerList.push(marker);
        });
        return markerList;
    }
    getGeoNameFromLatLng(map, latLng, isStartPoint) {
        var resultAddress: string;
        var mother = this;
        this.geocoder.geocode({ 'location': latLng }, function (results, status) {
            if (status === 'OK') {
                if (results[0]) {
                    var tempAddress = results[0].formatted_address;
                    // map.setZoom(11);
                    console.log(tempAddress);
                    if (isStartPoint) mother.startPointAddress = tempAddress;
                    else {
                        if (tempAddress == mother.startPointAddress) {
                            mother.searchedPoints.push();
                            var point = new google.maps.LatLng(parseFloat(latLng.lat), parseFloat(latLng.lng));
                            mother.placeoutsidemarker(map, point);
                        }
                    }
                    mother.getPointSameRoad(map, false);
                    // var marker = new google.maps.Marker({
                    //     position: latLng,
                    //     map: map
                    // });
                    // infowindow.setContent(results[0].formatted_address);
                    // infowindow.open(map, marker);
                }else if (status === 'OVER_QUERY_LIMIT') {
                    setTimeout(() => {
                        mother.getPointSameRoad(map, latLng);
                    }, 4000);
                }
                else {
                    console.log('No results found');
                }
            } else {
                // console.log('Geocoder failed due to: ' + status);
                setTimeout(() => {
                    mother.getPointSameRoad(map, latLng);
                }, 4000);
            }
        });

    }
    PointsInArea(map, startpoint) {
        this.countDone = 0;
        this.int_ds = 0;

        let str: string = `Start Point (lat: ${startpoint.lat}, lng: ${startpoint.lng})`;
        startpoint['text'] = str;
        this.createMaker(map, [startpoint]);
        this.searchedPoints = this.getCirclePoints(map, startpoint, this.distance);
        //For time based....
        //searchPoints = getCirclePoints(pt,(80*(timeToDrive/60)));	//120kmph * (time /60/60)

        this.searchPointsmax = this.searchedPoints.length;
        this.drivePolyPoints = Array();
        //this.getDirections(map, startpoint, false);
        this.getPointSameRoad(map, false);
    }
    getCirclePoints(map, center, radius) {
        var circlePoints = Array();
        var searchPoints = Array();


        //var rLat = (radius/3963.189) * (180/PI); // miles
        var rLat = (radius / 6378.135) * (180 / Math.PI); // km	
        var rLng = rLat / Math.cos(center.lat * (Math.PI / 180));
        this.getGeoNameFromLatLng(map, center, true);
        for (var a = 0; a < 361; a++) {
            var aRad = a * (Math.PI / 180);
            var x = center.lng + (rLng * Math.cos(aRad));
            var y = center.lat + (rLat * Math.sin(aRad));
            var point = new google.maps.LatLng(parseFloat(y), parseFloat(x));

            circlePoints.push(point);
            if (a % 5 == 0) {
                searchPoints.push(point);
            }
        }

        //searchPoints.reverse();
        searchPoints = this.shuffleArray(searchPoints);
        return searchPoints;
    }

    getPointSameRoad(map, point){
        if (point) {
            var backpoint = new google.maps.LatLng(parseFloat(point.lat), parseFloat(point.lng));
            //console.log("searchPoints.push");
            this.searchedPoints.push(backpoint);
        }
        if (!this.searchedPoints.length) {
            this.countDone += 1;
            //console.log("countDone="+countDone+"("+searchPointsmax+")");
            document.getElementById("wait").innerHTML = "<p><font color='#FF0000'>Finished!</font></p>";
            return;
        } else {
            var percent = Math.round(100 - ((this.searchedPoints.length / this.searchPointsmax) * 100));
            document.getElementById("wait").innerHTML = "<p><font color='#FF0000'>Processing " + percent + "%</font></p>";
        }
        var thispoint = this.searchedPoints[0];

        this.searchedPoints.shift();
        var mother = this;
        setTimeout(() => {
            mother.getGeoNameFromLatLng(map, { lat: thispoint.lat(), lng: thispoint.lng() }, false);
        }, 1000);
    }

    getDirections(map, startpoint, point) {
        //if there is a point to put back on to searchPoints...
        if (point) {
            //console.log("searchPoints.push");
            this.searchedPoints.push(point);
        }
        //if there are no more points to process...
        if (!this.searchedPoints.length) {
            this.countDone += 1;
            //console.log("countDone="+countDone+"("+searchPointsmax+")");
            document.getElementById("wait").innerHTML = "<p><font color='#FF0000'>Finished!</font></p>";
            return;
        } else {
            var percent = Math.round(100 - ((this.searchedPoints.length / this.searchPointsmax) * 100));
            document.getElementById("wait").innerHTML = "<p><font color='#FF0000'>Processing " + percent + "%</font></p>";
        }

        var from = startpoint.lat.toFixed(this.accDPs) + ' ' + startpoint.lng.toFixed(this.accDPs);
        var to = this.searchedPoints[0].lat().toFixed(this.accDPs) + ' ' + this.searchedPoints[0].lng().toFixed(this.accDPs);
        this.directionsDisplay.setMap(map);
        var request = {
            origin: from,
            destination: to,
            travelMode: 'DRIVING'
        };
        var thispoint = this.searchedPoints[0];
        //remove point from stack
        this.searchedPoints.shift();
        //console.log(to+"|"+from+"|"+distToDrive);
        //console.log(localStorage.getItem(to+"|"+from+"|"+distToDrive));
        var mother = this;
        if (typeof (Storage) !== "undefined") {
            if (sessionStorage.getItem(to + "|" + from + "|" + this.distance)) {
                console.log("Found Report");
                this.directionsearch(map, startpoint, sessionStorage.getItem(to + "|" + from + "|" + this.distance), google.maps.DirectionsStatus.OK, from, to, false, thispoint);
            } else {
                setTimeout(() => {
                    // alert('1');
                    this.directionsService.route(request, function (response, status, thispoint) {
                        // alert(response);
                        mother.directionsearch(map, startpoint, response, status, from, to, true, thispoint);
                    });
                }, 200);
            }

        } else {
            console.log("No Report");
            setTimeout(() => {
                // alert('2');
                this.directionsService.route(request, function (response, status, thispoint) {
                    // alert(response);
                    mother.directionsearch(map, startpoint, response, status, from, to, true, thispoint);
                });
            }, 200);
        }
    }
    directionsearch(map, startpoint, response, status, from, to, store, point) {
        //console.log("directionsearch status="+status);
        var mother = this;
        if (status == google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
            console.log("OVER_QUERY_LIMIT");
            setTimeout(() => {
                mother.getDirections(map, startpoint, point);
            }, 4000);
            //console.log("OVER_QUERY_LIMIT End");	
        } else {
            if (status == google.maps.DirectionsStatus.OK) {
                //var distance = parseInt(response.routes[0].legs[0].distance.value / 1609);
                //var duration = parseFloat(response.routes[0].legs[0].duration.value / 3600).toFixed(2);
                //console.log(response);

                var route_latlngs;

                if (response.routes) {
                    route_latlngs = response.routes[0].overview_path;
                } else {
                    //route_latlngs = JSON.parse(response.split("|")[0]);
                    route_latlngs = JSON.parse(response);
                    //console.log(route_latlngs);
                }

                //console.log(response.routes[0].legs[0].steps);

                if (store) {
                    console.log("Store");
                    setTimeout(() => {
                        mother.shortenAndShow(map, startpoint, route_latlngs, to, from, true);
                    }, 1500);
                    //setTimeout(function() { shortenAndShowWTime(response.routes[0].legs[0].steps, route_latlngs); }, 1500);
                } else {
                    mother.shortenAndShow(map, startpoint, route_latlngs, to, from, false);
                    //shortenAndShowWTime(response.routes[0].legs[0].steps, route_latlngs);
                }
            } else {
                if (status == "NOT_FOUND" || status == "ZERO_RESULTS") {
                    console.log("Route NOT_FOUND, so shortenAndTryAgain");
                    setTimeout(() => {
                        mother.shortenAndTryAgain(map, startpoint);
                    }, 500);
                }
            }
        }
    }
    shortenAndTryAgain(map, startpoint) {
        //bring it closer and try
        if (this.searchedPoints[0]) {
            var startPoint = new google.maps.LatLng(startpoint.lat(), startpoint.lng());
            var endPoint = new google.maps.LatLng(this.searchedPoints[0].lat(), this.searchedPoints[0].lng());
            var middlePoint = new google.maps.geometry.spherical.interpolate(startPoint, endPoint, this.percentageinterpolate);

            //console.log("getDirections with midpoint : " +middlePoint);
            this.getDirections(map, startpoint, middlePoint);
        } else {
            //console.log("getDirections false");
            this.getDirections(map, startpoint, false);
        }
    }

    shortenAndShow(map, startpoint, overview_pathlatlngs, to, from, boolStore) {
        var distToDrivekm = this.distance * 1000;
        var dist = 0;
        var cutoffIndex = 0;
        var perimeterPoints = Array();

        var boolCrossedThreshold = false;

        //loop through each leg of the route
        for (var n = 0; n < overview_pathlatlngs.length - 1; n++) {

            var alat = overview_pathlatlngs[n].lat;
            if (typeof alat !== "number") {
                alat = overview_pathlatlngs[n].lat();
            }

            var alng = overview_pathlatlngs[n].lng;
            if (typeof alng !== "number") {
                alng = overview_pathlatlngs[n].lng();
            }

            var blat = overview_pathlatlngs[n + 1].lat;
            if (typeof blat !== "number") {
                blat = overview_pathlatlngs[n + 1].lat();
            }

            var blng = overview_pathlatlngs[n + 1].lng;
            if (typeof blng !== "number") {
                blng = overview_pathlatlngs[n + 1].lng();
            }


            var pointA = new google.maps.LatLng(alat, alng);
            var pointB = new google.maps.LatLng(blat, blng);

            //add this this leg distance to running total (dist)
            dist += google.maps.geometry.spherical.computeDistanceBetween(pointA, pointB);

            //if running total is less than threshold
            if (dist < distToDrivekm) {
                //Add to perimeterPoints
                perimeterPoints.push(pointA);
            } else {
                boolCrossedThreshold = true
                break; // exit loop
            }
        }

        //console.log("boolCrossedThreshold="+boolCrossedThreshold);

        var lastPoint = perimeterPoints[perimeterPoints.length - 1];

        var polyroadroute = new google.maps.Polyline({
            path: perimeterPoints,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 1
        });

        //show the road route?
        polyroadroute.setMap(map);
        //add to the array of road routes
        this.polyroadroutes.push(polyroadroute);

        this.drivePolyPoints.push(lastPoint);
        //store
        // if (boolStore) {
        //   ftnReport(to, from, distToDrive, perimeterPoints, lastPoint);
        // }
        //store

        //create drivePolygon when 1 item in array (first time round only)
        if (this.drivePolyPoints.length == 1) {
            this.drivePolygon = new google.maps.Polygon({
                paths: this.drivePolyPoints,
                strokeColor: '#0000ff',
                strokeOpacity: 0.8,
                strokeWeight: 1,
                fillColor: "#2fff0f",
                fillOpacity: 0.35,
                clickable: false,
                map: map
            });

            this.drivePolygons.push(this.drivePolygon);
        }

        this.sortPoints2Polygon();

        this.drivePolygon.setPaths(this.drivePolyPoints);


        this.addBorderMarker(map, startpoint, lastPoint, dist);


        // placePoints.push(lastPoint);

        //setTimeout("getDirections(false)", 50 );	//Add some delay
        this.getDirections(map, startpoint, false);
    }
    addBorderMarker(map, startpoint, pt, d) {
        this.ds.push(d);

        var pointstring = pt.lat() + "," + pt.lng();
        var mother = this;
        this.geocoder.geocode({
            'latLng': pt
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    mother.placeMarker(map, startpoint, pt, results[1].formatted_address, false);
                    // this.routeMarkers.push(marker);

                } else {
                    //alert('No results found');
                    mother.placeMarker(map, startpoint, pt, '', false);
                    // routeMarkers.push(marker);
                }
            } else {
                //alert('Geocoder failed due to: ' + status);
                this.createMaker(pt, '', false);
                // routeMarkers.push(marker);
            }
        });
    }
    sortPoints2Polygon() {
        var points = [];
        var bounds = new google.maps.LatLngBounds();

        for (var i = 0; i < this.drivePolyPoints.length; i++) {


            var alat = this.drivePolyPoints[i].lat();
            var alng = this.drivePolyPoints[i].lng();


            var pointA = new google.maps.LatLng(alat, alng);

            points.push(pointA);
            bounds.extend(pointA);

        }

        var center = bounds.getCenter();
        var bearing = [];

        for (var i = 0; i < points.length; i++) {
            points[i].bearing = google.maps.geometry.spherical.computeHeading(center, points[i]);
        }

        points.sort(this.bearingsort);

        // FMTkmlcoordinates = "";
        // for (var i = 0; i < points.length; i++) {
        //     FMTkmlcoordinates += points[i].lng() + "," + points[i].lat() + ",0 ";
        // }

        // FMTkmlcoordinates += points[0].lng() + "," + points[0].lat() + ",0 "; //Fix issue with unclosed polygon

        this.drivePolyPoints = points;
    }
    bearingsort(a, b) {
        return (a.bearing - b.bearing);
    }
    placeMarker(map, startpoint, location, text, isstartpoint) {
        //console.log(location);
        var routePoints = new Array(0);
        routePoints.push(location);
        routePoints.push(startpoint);

        var d_D_AS_CF: number = this.finddistance(routePoints);
        var d = this.ds[this.int_ds];
        var str = 'Distance by road: ' + (d / 1000).toFixed(2) + ' km (' + (0.621371192 * d / 1000).toFixed(2) + ' miles)' + ' - Distance as the crow flies : ' + d_D_AS_CF + ' km (' + (d_D_AS_CF * 0.621371192).toFixed(2) + ' miles)';

        if (!isstartpoint) {
            text = text + ' | ' + str;
        }

        var marker = new google.maps.Marker({
            position: location,
            map: map,
            title: text,
            draggable: false,
            opacity: 0.35
        });

        return marker;
    }
    finddistance(route) {
        var dist = 0;
        dist = google.maps.geometry.spherical.computeLength(route);

        dist = dist / 1000;
        return dist;
    }
    shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
    placeoutsidemarker(map, myLatlng) {
        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
        });
    }
}