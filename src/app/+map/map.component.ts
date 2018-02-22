import { Component, Directive, Input, OnInit } from '@angular/core';
import { forEach } from '@angular/router/src/utils/collection';
import { DataService } from '../core/services/data.service';
import { Response } from '@angular/http/src/static_response';
declare var google: any;
@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
    roads: any;
    accDPs: number = 4;
    directionsDisplay: any;
    directionsService: any;
    polyroadroutes = [];
    routeMarkersLatLng = [];
    routeMarkers = [];
    geocoder: any;
    map: any;
    constructor(private dataService: DataService) {
    }

    public ngOnInit() {
        this.initMap();
    }

    initMap() {
        this.dataService.get("http://localhost:51375/api/map").subscribe((res: Response) => {
            console.log(res);
            this.roads = res;
            if (this.roads.length > 0) {
                var startpoint = new google.maps.LatLng(this.roads[0].slat, this.roads[0].slng);

                this.directionsService = new google.maps.DirectionsService();
                this.directionsDisplay = new google.maps.DirectionsRenderer();

                this.map = new google.maps.Map(document.getElementById('gmap'), {
                    zoom: 15,
                    center: startpoint,
                });
                var mother = this;
                this.map.addListener('click', function (event) {
                    for (var i = 0; i < mother.routeMarkers.length; i++) {
                        mother.routeMarkers[i].setMap(null);
                    }
                });
                this.geocoder = new google.maps.Geocoder();
                this.directionsDisplay = new google.maps.DirectionsRenderer();
                this.directionsDisplay.setMap(this.map);
                this.roads.forEach(road => { this.drawRoute(road); });
            } else {
                console.log("error! no data!");
            }
        }, error => console.log(error));
    }
    drawRoute(road) {
        var currentRoad = road;
        var from = road.slat.toFixed(this.accDPs) + ' ' + road.slng.toFixed(this.accDPs);
        var to = road.elat.toFixed(this.accDPs) + ' ' + road.elng.toFixed(this.accDPs);
        this.directionsDisplay.setMap(this.map);
        var request = {
            origin: from,
            destination: to,
            travelMode: 'DRIVING'
        };
        var mother = this;
        setTimeout(() => {
            this.directionsService.route(request, function (response, status) {
                mother.directionsearch(response, status, from, to, true, currentRoad);
            });
        }, 100);
    }
    directionsearch(response, status, from, to, store, road) {
        //console.log("directionsearch status="+status);
        var mother = this;
        if (status == google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
            console.log("OVER_QUERY_LIMIT");
            setTimeout(() => {
                mother.drawRoute(road);
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
                    // route_latlngs = JSON.parse(response.split("|")[0]);
                    route_latlngs = JSON.parse(response);
                    // console.log(route_latlngs);
                }
                if (store) {
                    console.log("Store");
                    setTimeout(() => {
                        mother.shortenAndShow(route_latlngs, to, from, road);
                    }, 1500);
                } else {
                    mother.shortenAndShow(route_latlngs, to, from, road);
                }
            } else {
                if (status == "NOT_FOUND" || status == "ZERO_RESULTS") {
                    console.log("Route NOT_FOUND, so shortenAndTryAgain");
                }
            }
        }
    }

    shortenAndShow(overview_pathlatlngs, to, from, road) {
        var dist = 0;
        var cutoffIndex = 0;
        var perimeterPoints = Array();
        //loop through each leg of the route
        for (var n = 0; n < overview_pathlatlngs.length - 1; n++) {
            var lat = overview_pathlatlngs[n].lat;
            if (typeof lat !== "number") {
                lat = overview_pathlatlngs[n].lat();
            }
            var lng = overview_pathlatlngs[n].lng;
            if (typeof lng !== "number") {
                lng = overview_pathlatlngs[n].lng();
            }
            if (n == 0 || n == overview_pathlatlngs.length - 2) {
                this.routeMarkersLatLng.push({ roadId: road.id, latLng: new google.maps.LatLng(lat, lng) });
                // this.createMaker(road.description, new google.maps.LatLng(lat, lng));
            }

            perimeterPoints.push(new google.maps.LatLng(lat, lng));
        }
        //console.log("boolCrossedThreshold="+boolCrossedThreshold);
        var polyroadroute = new google.maps.Polyline({
            path: perimeterPoints,
            geodesic: true,
            strokeColor: road.color,
            strokeOpacity: 0.9,
            strokeWeight: 8
        });
        var mother = this;
        polyroadroute.addListener('click', function () {
            var bounds = new google.maps.LatLngBounds();
            mother.routeMarkers.forEach(marker => {
                marker.setMap(null);
            });
            mother.routeMarkersLatLng.forEach(marker => {
                if (marker.roadId == road.id) {
                    var mark = mother.createMaker(road.description, marker.latLng);
                    mark.addListener('click', function () {
                        mother.showInfoWindow(mother.map, road, mark, marker);
                    });
                    bounds.extend(marker.latLng);
                    mother.routeMarkers.push(mark);
                }
            });
            mother.map.fitBounds(bounds);
        });
        //show the road route?
        polyroadroute.setMap(this.map);
        //add to the array of road routes
        this.polyroadroutes.push(polyroadroute);
        //this.addBorderMarker(lastPoint, dist);
    }
    showInfoWindow(map, road, marker, markerLatLng) {
        let str: string;
        var mother = this;
        this.geocoder.geocode({
            'latLng': markerLatLng.latLng
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    str = road.description + " (lat: " + markerLatLng.latLng.lat() + "; lng: " + markerLatLng.latLng.lng() + "), location: " + results[0].formatted_address;

                    var infowindow = new google.maps.InfoWindow({
                        content: str
                    });
                    infowindow.open(map, marker);
                }
            }
        });
    }
    createMaker(text, latlng) {
        var marker = new google.maps.Marker({
            position: latlng,
            map: this.map,
            title: text
        });
        return marker;
    }
}
interface Road {
    id: number;
    slat: number;
    slng: number;
    elat: number;
    elng: number;
    distance: number;
    color: string;
    description: string;
}