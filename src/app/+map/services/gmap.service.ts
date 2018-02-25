import { Injectable } from '@angular/core';
import { Constants } from 'app/constants';
import { forEach } from '@angular/router/src/utils/collection';
import { GMap } from '../models/Map';
import { Road } from '../models/Road';
import { UtilityService } from '../../core/services/utility.service';
declare let google: any;
let globalGmapControl: any;
let isSnapEnable: boolean;
let snapPoints: Array<any>;
@Injectable()
export class GmapService {
    directionsDisplay: any;
    directionsService: any;
    polyroadroutes = [];
    routeMarkersLatLng = [];
    routeMarkers = [];
    geocoder: any;
    gmap: GMap;
    directionResponses: any; // bien luu tru 2 tuyen duong kha thi giua 2 toa do
    constructor(private utilityService: UtilityService) { }

    public initGoogleMap(obj) {
        isSnapEnable = false;
        this.gmap = obj;
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
            if(!isSnapEnable){
                for (let i = 0; i < mother.routeMarkers.length; i++) {
                    mother.routeMarkers[i].setMap(null);
                }
            }
        });
        this.geocoder = new google.maps.Geocoder();
        this.directionsDisplay = new google.maps.DirectionsRenderer();
        this.directionsDisplay.setMap(this.gmap.controller);
        this.directionResponses = [];
        this.gmap.roads.forEach(road => { 
            this.drawRoute(road); 
        });
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
                globalGmapControl.gmap.controller.setOptions({ draggableCursor: 'pointer' });
                document.getElementById('setPoint').style.backgroundColor = '#fff';
                document.getElementById('setPoint').style.border = '2px solid #fff';
                isSnapEnable = false;
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
                globalGmapControl.routeMarkers.push(marker);
                if (marker) {
                    snapPoints.push(event.latLng);
                    if (snapPoints.length == 2) {
                        isSnapEnable = false;

                        globalGmapControl.gmap.controller.setOptions({ draggableCursor: 'pointer' });
                        document.getElementById('setPoint').style.backgroundColor = '#fff';
                        document.getElementById('setPoint').style.border = '2px solid #fff';
                        let newRoad = new Road(
                            globalGmapControl.polyroadroutes.length + 1,
                            snapPoints[0].lat(),
                            snapPoints[0].lng(),
                            snapPoints[1].lat(),
                            snapPoints[1].lng(),
                            0,
                            "",
                            "new road"
                        );
                        globalGmapControl.gmap.roads.push(newRoad);
                        globalGmapControl.drawRoute(newRoad);
                        snapPoints = [];
                    }
                }
            }
            // globalGmapControl.createMaker('(lat: '+event.latLng.lat()+'; lng: '+event.latLng.lng()+')', event.latLng);
        });
    }

    private drawRoute(road: Road) {
        let destCoodrs = [
            new google.maps.LatLng(road.slat, road.slng),
            new google.maps.LatLng(road.elat, road.elng)
        ];
        let waypts = [];
        destCoodrs.forEach(coodr => {
            waypts.push({ location: coodr, stopover: true });
        });

        this.directionsDisplay.setMap(this.gmap.controller);
        let request = {
            origin: destCoodrs[0],
            destination: destCoodrs[destCoodrs.length - 1],
            waypoints: waypts,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };
        let mother = this;
        setTimeout(() => {
            this.directionsService.route(request, function (response, status) {
                mother.directionsearch(response, status, destCoodrs, true, road);
            });
        }, 500);
    }

    private directionsearch(response: any, status: string, destCoodrs: Array<any>, store: boolean, road: Road) {
        //console.log("directionsearch status="+status);
        let mother = this;
        if (status == google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
            console.log("OVER_QUERY_LIMIT");
            setTimeout(() => {
                mother.drawRoute(road);
            }, 100);
            //console.log("OVER_QUERY_LIMIT End");	
        } else {
            if (status == google.maps.DirectionsStatus.OK) {
                let currentResponses = [];
                for(var i=0; i < mother.directionResponses.length; i++){
                    if(mother.directionResponses[i].id == road.id){
                        currentResponses.push(mother.directionResponses[i]);
                    }
                }
                if (currentResponses.length < 2) {
                    mother.directionResponses.push({id: road.id, response: response});
                    currentResponses.push({id: road.id, response: response});
                    if (currentResponses.length < 2) {
                        setTimeout(() => {
                            mother.drawRoute(new Road(road.id, road.elat, road.elng, road.slat, road.slng, 0, road.color, road.description));
                        }, 10);
                    }else {
                        let distance1: number = currentResponses[0].response.routes[0].legs[1].distance.value;
                        let distance2: number = currentResponses[1].response.routes[0].legs[1].distance.value;
                        let correctRoadResponse: any;
                        console.log('road id:'+road.id+':'+distance1+'--'+distance2);
                        if (distance1 < distance2) {
                            correctRoadResponse = currentResponses[0].response;
                        } else {
                            correctRoadResponse = currentResponses[1].response;
                        }
                        mother.directionResponses = [];
                        //let duration = parseFloat(response.routes[0].legs[0].duration.value / 3600).toFixed(2);
    
                        let route_latlngs: string;
                        if (correctRoadResponse.routes) {
                            route_latlngs = correctRoadResponse.routes[0].overview_path;
                        } else {
                            // route_latlngs = JSON.parse(response.split("|")[0]);
                            route_latlngs = JSON.parse(correctRoadResponse);
                            // console.log(route_latlngs);
                        }
                        if (store) {
                            console.log("Store");
                            setTimeout(() => {
                                mother.shortenAndShow(route_latlngs, road);
                            }, 1500);
                        } else {
                            mother.shortenAndShow(route_latlngs, road);
                        }
                        let bounds = new google.maps.LatLngBounds();
                        mother.gmap.roads.forEach(road => {
                            bounds.extend(new google.maps.LatLng(road.slat, road.slng));
                            bounds.extend(new google.maps.LatLng(road.elat, road.elng));
                        });
                        mother.gmap.controller.fitBounds(bounds);
                    }
                } 
            } else {
                if (status == "NOT_FOUND" || status == "ZERO_RESULTS") {
                    console.log("Route NOT_FOUND, so shortenAndTryAgain");
                }
            }
        }
    }

    private shortenAndShow(overview_pathlatlngs: any, road: Road) {
        let perimeterPoints = Array();
        //loop through each leg of the route
        for (let n = 0; n < overview_pathlatlngs.length; n++) {
            let lat = overview_pathlatlngs[n].lat;
            if (typeof lat !== "number") {
                lat = overview_pathlatlngs[n].lat();
            }
            let lng = overview_pathlatlngs[n].lng;
            if (typeof lng !== "number") {
                lng = overview_pathlatlngs[n].lng();
            }
            if (n == 0 || n == overview_pathlatlngs.length - 1) {
                this.routeMarkersLatLng.push({ roadId: road.id, latLng: new google.maps.LatLng(lat, lng) });
                // this.createMaker(road.description, new google.maps.LatLng(lat, lng));
            }

            perimeterPoints.push(new google.maps.LatLng(lat, lng));
        }
        //console.log("boolCrossedThreshold="+boolCrossedThreshold);
        let color: string;
        if (road.color == "") {
            color = this.utilityService.getRandomColor();
        } else {
            color = road.color;
        }
        let polyroadroute = new google.maps.Polyline({
            path: perimeterPoints,
            geodesic: true,
            strokeColor: color,
            strokeOpacity: 0.8,
            strokeWeight: 8
        });
        let mother = this;
        polyroadroute.addListener('click', function () {
            let bounds = new google.maps.LatLngBounds();
            mother.routeMarkers.forEach(marker => {
                marker.setMap(null);
            });
            mother.routeMarkersLatLng.forEach(marker => {
                if (marker.roadId == road.id) {
                    let mark = mother.createMaker(road.description, marker.latLng, road.id, true);
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

    private createMaker(text: string, latlng: any, roadId: number, isDraggable: boolean) {
        let marker = new google.maps.Marker({
            position: latlng,
            draggable: isDraggable,
            map: this.gmap.controller,
            title: text
        });
        marker.set("id",roadId);
        marker.addListener('dragend', function(event){
            console.log(event);
        })
        return marker;
    }
}