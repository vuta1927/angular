import { Injectable } from '@angular/core';
import { Constants } from 'app/constants';
import { forEach } from '@angular/router/src/utils/collection';
import { GMap } from '../models/Map';
import { Road } from '../models/Road';
declare let google: any;
let globalMap: any;
let globalGmapControl: any;
let isSnapEnable: boolean;
let snapPoints: Array<any>;
let glRoads: Array<any>;
@Injectable()
export class GmapService {
    directionsDisplay: any;
    directionsService: any;
    polyroadroutes = [];
    routeMarkersLatLng = [];
    routeMarkers = [];
    geocoder: any;
    gmap: GMap;
    constructor() { }

    public initGoogleMap(obj) {
        isSnapEnable = false;
        this.gmap = obj;
        glRoads = [];
        let startpoint = new google.maps.LatLng(this.gmap.roads[0].slat, this.gmap.roads[0].slng);

        this.directionsService = new google.maps.DirectionsService();
        this.directionsDisplay = new google.maps.DirectionsRenderer();

        this.gmap.controller = new google.maps.Map(document.getElementById('gmap'), {
            zoom: 15,
            center: startpoint,
        });
        globalGmapControl = this;
        let mother = this;
        this.gmap.controller.addListener('click', function (event) {
            for (let i = 0; i < mother.routeMarkers.length; i++) {
                mother.routeMarkers[i].setMap(null);
            }
        });
        this.geocoder = new google.maps.Geocoder();
        this.directionsDisplay = new google.maps.DirectionsRenderer();
        this.directionsDisplay.setMap(this.gmap.controller);
        this.gmap.roads.forEach(road => { this.drawRoute(road); });
        this.gmap.controller.setOptions({ draggableCursor: 'pointer' });
        this.initializeSnapToRoad();
    }

    private initializeSnapToRoad() {
        this.drawControl();
    }

    private drawControl() {
        //### Add a button on Google Maps ...
        snapPoints = [];
        var addPointControl = document.createElement('DIV');
        addPointControl.id = 'setPoint';
        addPointControl.style.cursor = 'pointer';
        addPointControl.style.backgroundColor = '#fff';
        addPointControl.style.border = '2px solid #fff';
        addPointControl.style.borderRadius = '3px';
        addPointControl.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        addPointControl.style.backgroundImage = "url(https://cdn2.iconfinder.com/data/icons/navigation-and-mapping-1/65/path2-24.png)";
        addPointControl.style.marginTop = '12px';
        addPointControl.style.height = '28px';
        addPointControl.style.width = '28px';
        //    addPointControl.style.top = '11px';
        //    addPointControl.style.left = '120px';
        addPointControl.title = 'Click to set start point and end point of road.';
        //myLocationControlDiv.appendChild( addPointControl);

        this.gmap.controller.controls[google.maps.ControlPosition.TOP_CENTER].push(addPointControl);

        addPointControl.addEventListener('click', function (event) {
            if (isSnapEnable) {
                return;
            }
            isSnapEnable = true;
            globalGmapControl.gmap.controller.setOptions({ draggableCursor: 'crosshair' });
            // console.log(element);
            document.getElementById('setPoint').style.backgroundColor = '#ddd';
            document.getElementById('setPoint').style.border = '2px solid #ddd';
        });

        this.gmap.controller.addListener('click', function (event) {
            if (!isSnapEnable) {
                return;
            }
            if (snapPoints.length < 2) {
                let marker = new google.maps.Marker({
                    position: event.latLng,
                    map: globalGmapControl.gmap.controller,
                    title: '(lat: ' + event.latLng.lat() + '; lng: ' + event.latLng.lng() + ')'
                });
                if (marker) {
                    snapPoints.push(event.latLng);
                    if (snapPoints.length == 2) {
                        isSnapEnable = false;
                        globalGmapControl.gmap.controller.setOptions({ draggableCursor: 'pointer' });
                        document.getElementById('setPoint').style.backgroundColor = '#fff';
                        document.getElementById('setPoint').style.border = '2px solid #fff';
                        globalGmapControl.drawRoute(
                            new Road(
                                glRoads.length,
                                snapPoints[0].lat(),
                                snapPoints[0].lng(),
                                snapPoints[1].lat(),
                                snapPoints[1].lng(),
                                0,
                                "#000",
                                "new road"
                            ));
                        snapPoints = [];
                    }
                }
            }
            // globalGmapControl.createMaker('(lat: '+event.latLng.lat()+'; lng: '+event.latLng.lng()+')', event.latLng);
        });
    }

    private drawRoute(road: Road) {
        let from = road.slat.toFixed(Constants.accDPs) + ' ' + road.slng.toFixed(Constants.accDPs);
        let to = road.elat.toFixed(Constants.accDPs) + ' ' + road.elng.toFixed(Constants.accDPs);
        // let from = road.slat + ' ' + road.slng;
        // let to = road.elat + ' ' + road.elng;
        this.directionsDisplay.setMap(this.gmap.controller);
        let request = {
            origin: from,
            destination: to,
            travelMode: 'DRIVING'
        };
        let mother = this;
        setTimeout(() => {
            this.directionsService.route(request, function (response, status) {
                mother.directionsearch(response, status, from, to, true, road);
            });
        }, 100);
    }

    private directionsearch(response: any, status: string, from: string, to: string, store: boolean, road: Road) {
        //console.log("directionsearch status="+status);
        let mother = this;
        if (status == google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
            console.log("OVER_QUERY_LIMIT");
            setTimeout(() => {
                mother.drawRoute(road);
            }, 4000);
            //console.log("OVER_QUERY_LIMIT End");	
        } else {
            if (status == google.maps.DirectionsStatus.OK) {
                //let distance = parseInt(response.routes[0].legs[0].distance.value / 1609);
                //let duration = parseFloat(response.routes[0].legs[0].duration.value / 3600).toFixed(2);
                //console.log(response);
                let route_latlngs: string;

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

    private shortenAndShow(overview_pathlatlngs: any, to: string, from: string, road: Road) {
        let dist: number = 0;
        let cutoffIndex: number = 0;
        let perimeterPoints = Array();
        //loop through each leg of the route
        for (let n = 0; n < overview_pathlatlngs.length - 1; n++) {
            let lat = overview_pathlatlngs[n].lat;
            if (typeof lat !== "number") {
                lat = overview_pathlatlngs[n].lat();
            }
            let lng = overview_pathlatlngs[n].lng;
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
        let polyroadroute = new google.maps.Polyline({
            path: perimeterPoints,
            geodesic: true,
            strokeColor: road.color,
            strokeOpacity: 0.9,
            strokeWeight: 8
        });
        let mother = this;
        glRoads.push(road);
        polyroadroute.addListener('click', function () {
            let bounds = new google.maps.LatLngBounds();
            mother.routeMarkers.forEach(marker => {
                marker.setMap(null);
            });
            mother.routeMarkersLatLng.forEach(marker => {
                if (marker.roadId == road.id) {
                    let mark = mother.createMaker(road.description, marker.latLng);
                    mark.addListener('click', function () {
                        mother.showInfoWindow(mother.gmap.controller, road, mark, marker);
                    });
                    bounds.extend(marker.latLng);
                    mother.routeMarkers.push(mark);
                }
            });
            mother.gmap.controller.fitBounds(bounds);
        });
        //show the road route?
        polyroadroute.setMap(this.gmap.controller);
        //add to the array of road routes
        this.polyroadroutes.push(polyroadroute);
        //this.addBorderMarker(lastPoint, dist);
    }

    private showInfoWindow(map, road, marker, markerLatLng) {
        let str: string;
        let mother = this;
        this.geocoder.geocode({
            'latLng': markerLatLng.latLng
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    str = road.description + " (lat: " + markerLatLng.latLng.lat() + "; lng: " + markerLatLng.latLng.lng() + "), location: " + results[0].formatted_address;

                    let infowindow = new google.maps.InfoWindow({
                        content: str
                    });
                    infowindow.open(map, marker);
                }
            }
        });
    }

    private createMaker(text: string, latlng: any) {
        let marker = new google.maps.Marker({
            position: latlng,
            map: this.gmap.controller,
            title: text
        });
        return marker;
    }
}