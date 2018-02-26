import { Injectable } from '@angular/core';
import { Constants } from 'app/constants';
import { forEach } from '@angular/router/src/utils/collection';
import { GMap } from '../models/Map';
import { Road, Coordinate } from '../models/Road';
import { UtilityService } from '../../core/services/utility.service';
import {FormsModule} from '@angular/forms';
declare let google: any;
let GLOBAL = {
    snapPoints: [],
    GmapService: null,
    isSnapEnable: false,
    oldMarker: null
};
@Injectable()
export class GmapService {
    directionsDisplay: any;
    directionsService: any;
    polyroadroutes = [];
    routeMarkersLatLng = [];
    routeMarkers = [];
    geocoder: any;
    gmap: GMap;
    drawMode = {
        Default: false,
        SnapMode: true
    };
    currentRoad: Road;
    Popup: any;
    inforWindows = [];
    directionResponses: any; // bien luu tru 2 tuyen duong kha thi giua 2 toa do
    constructor(private utilityService: UtilityService) { }

    public initGoogleMap(obj) {
        this.gmap = obj;

        this.directionsService = new google.maps.DirectionsService();
        this.directionsDisplay = new google.maps.DirectionsRenderer();

        this.gmap.controller = new google.maps.Map(document.getElementById('gmap'), {
            center: { lat: 21.027884, lng: 105.833974 },
            zoom: 5
        });
        let bounds = new google.maps.LatLngBounds();
        this.gmap.roads.forEach(road => {
            bounds.extend(new google.maps.LatLng(road.paths[0].lat, road.paths[0].lng));
            bounds.extend(new google.maps.LatLng(road.paths[road.paths.length - 1].lat, road.paths[road.paths.length - 1].lng));
        });
        this.gmap.controller.fitBounds(bounds);
        GLOBAL.GmapService = this;

        let mother = this;
        this.gmap.controller.addListener('click', function (event) {
            if (!GLOBAL.isSnapEnable) {
                for (let i = 0; i < mother.routeMarkers.length; i++) {
                    mother.routeMarkers[i].setMap(null);
                }
            }
            for(var i=0;i < mother.inforWindows.length; i++){
                mother.inforWindows[i].setMap(null);
            }
        });
        this.geocoder = new google.maps.Geocoder();
        this.directionsDisplay = new google.maps.DirectionsRenderer();
        this.directionsDisplay.setMap(this.gmap.controller);
        this.directionResponses = [];
        this.gmap.roads.forEach(road => {
            this.drawRoute(road, this.drawMode.Default);
        });
        this.gmap.controller.setOptions({ draggableCursor: 'default' });
        let parentElement = document.createElement('DIV');
        if (this.gmap.editMode) {
            this.initializeSnapToRoad(parentElement);
        }
        this.initializeResetView(parentElement);
    }

    private initializeSnapToRoad(parentElement: any) {
        var addPointControl = document.createElement('DIV');
        addPointControl.id = 'setPoint';
        addPointControl.style.cursor = 'pointer';
        addPointControl.style.backgroundColor = '#fff';
        addPointControl.style.border = '2px solid #fff';
        addPointControl.style.borderRadius = '2px';
        addPointControl.style.boxShadow = '0 1px 2px rgba(0,0,0,.3)';
        addPointControl.style.backgroundImage = "url(https://cdn2.iconfinder.com/data/icons/navigation-and-mapping-1/65/path2-24.png)";
        addPointControl.style.marginTop = '12px';
        addPointControl.style.height = '28px';
        addPointControl.style.width = '28px';
        //    addPointControl.style.top = '11px';
        //    addPointControl.style.left = '120px';
        addPointControl.title = 'Click to set start point and end point of road.';
        parentElement.appendChild(addPointControl);

        this.gmap.controller.controls[google.maps.ControlPosition.TOP_CENTER].push(addPointControl);

        addPointControl.addEventListener('click', function (event) {
            if (GLOBAL.isSnapEnable) {
                GLOBAL.GmapService.gmap.controller.setOptions({ draggableCursor: 'default' });
                document.getElementById('setPoint').style.backgroundColor = '#fff';
                document.getElementById('setPoint').style.border = '2px solid #fff';
                GLOBAL.isSnapEnable = false;
                return;
            }
            GLOBAL.isSnapEnable = true;
            GLOBAL.GmapService.gmap.controller.setOptions({ draggableCursor: 'crosshair' });
            document.getElementById('setPoint').style.backgroundColor = '#ddd';
            document.getElementById('setPoint').style.border = '2px solid #ddd';
        });

        this.gmap.controller.addListener('click', function (event) {
            if (!GLOBAL.isSnapEnable) {
                return;
            }
            if (GLOBAL.snapPoints.length < 2) {
                let marker = new google.maps.Marker({
                    position: event.latLng,
                    map: GLOBAL.GmapService.gmap.controller,
                    title: '(lat: ' + event.latLng.lat() + '; lng: ' + event.latLng.lng() + ')'
                });
                GLOBAL.GmapService.routeMarkers.push(marker);
                if (marker) {
                    GLOBAL.snapPoints.push(event.latLng);
                    if (GLOBAL.snapPoints.length == 2) {
                        GLOBAL.isSnapEnable = false;

                        GLOBAL.GmapService.gmap.controller.setOptions({ draggableCursor: 'default' });
                        document.getElementById('setPoint').style.backgroundColor = '#fff';
                        document.getElementById('setPoint').style.border = '2px solid #fff';
                        let newRoad = new Road(
                            GLOBAL.GmapService.polyroadroutes.length + 1,
                            [
                                new Coordinate(GLOBAL.snapPoints[0].lat(), GLOBAL.snapPoints[0].lng()),
                                new Coordinate(GLOBAL.snapPoints[GLOBAL.snapPoints.length - 1].lat(), GLOBAL.snapPoints[GLOBAL.snapPoints.length - 1].lng())
                            ],
                            0,
                            "",
                            ""
                        );
                        GLOBAL.GmapService.gmap.roads.push(newRoad);
                        var loading = document.getElementById('wait');
                        loading.innerHTML = "<p><b><font size='4'>map processing, please wait for a moment ......</font></b><img src='https://loading.io/spinners/gears/index.dual-gear-loading-icon.svg' height='30' width='30'></p>";
                        GLOBAL.GmapService.drawRoute(newRoad, GLOBAL.GmapService.drawMode.SnapMode);
                        GLOBAL.snapPoints = [];
                    }
                }
            }
            // GLOBAL.GmapService.createMaker('(lat: '+event.latLng.lat()+'; lng: '+event.latLng.lng()+')', event.latLng);
        });
    }

    private initializeResetView(parentElement: any) {
        var resetViewControl = document.createElement('a');
        resetViewControl.id = 'resetView';
        resetViewControl.style.cursor = 'pointer';
        resetViewControl.style.backgroundColor = '#fff';
        resetViewControl.style.border = '2px solid #fff';
        resetViewControl.style.borderRadius = '2px';
        resetViewControl.style.boxShadow = '0 1px 2px rgba(0,0,0,.3)';
        resetViewControl.style.backgroundImage = "url(https://cdn0.iconfinder.com/data/icons/faticons-2/29/refresh27-24.png)";
        resetViewControl.style.marginTop = '12px';
        resetViewControl.style.height = '28px';
        resetViewControl.style.width = '28px';
        //    addPointControl.style.top = '11px';
        resetViewControl.style.left = '120px';
        resetViewControl.title = 'Click to reset view.';
        parentElement.appendChild(resetViewControl);

        this.gmap.controller.controls[google.maps.ControlPosition.TOP_CENTER].push(resetViewControl);

        resetViewControl.addEventListener('click', function () {
            let bounds = new google.maps.LatLngBounds();
            GLOBAL.GmapService.gmap.roads.forEach(road => {
                bounds.extend(new google.maps.LatLng(road.paths[0].lat, road.paths[0].lng));
                bounds.extend(new google.maps.LatLng(road.paths[road.paths.length - 1].lat, road.paths[road.paths.length - 1].lng));
            });
            GLOBAL.GmapService.routeMarkers.forEach(marker => {
                marker.setMap(null);
            });
            GLOBAL.GmapService.gmap.controller.fitBounds(bounds);
        });
    }

    private drawRoute(road: Road, isSnapMode) {
        if (!isSnapMode) {
            this.shortenAndShow(false, road);
        } else {
            let destCoodrs = [
                new google.maps.LatLng(road.paths[0].lat, road.paths[0].lng),
                new google.maps.LatLng(road.paths[road.paths.length - 1].lat, road.paths[road.paths.length - 1].lng)
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
                    mother.directionsearch(response, status, destCoodrs, road);
                });
            }, 1000);
        }
    }

    private directionsearch(response: any, status: string, destCoodrs: Array<any>, road: Road) {
        let mother = this;
        if (status == google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
            console.log("OVER_QUERY_LIMIT");
            setTimeout(() => {
                mother.drawRoute(road, mother.drawMode.SnapMode);
            }, 1000);
        } else {
            if (status == google.maps.DirectionsStatus.OK) {
                let currentResponses = [];
                for (var i = 0; i < mother.directionResponses.length; i++) {
                    if (mother.directionResponses[i].id == road.id) {
                        currentResponses.push(mother.directionResponses[i]);
                    }
                }
                if (currentResponses.length < 2) {
                    mother.directionResponses.push({ id: road.id, response: response });
                    currentResponses.push({ id: road.id, response: response });
                    if (currentResponses.length < 2) {
                        let newPaths = [];
                        for (var i = road.paths.length - 1; i >= 0; i--) {
                            newPaths.push(road.paths[i]);
                        }
                        setTimeout(() => {
                            mother.drawRoute(new Road(road.id, newPaths, 0, road.color, road.metaData), mother.drawMode.SnapMode);
                        }, 10);
                    } else {
                        let distance1: number = currentResponses[0].response.routes[0].legs[1].distance.value;
                        let distance2: number = currentResponses[1].response.routes[0].legs[1].distance.value;
                        let correctRoadResponse: any;
                        if (distance1 < distance2) {
                            road.distance = distance1;
                            correctRoadResponse = currentResponses[0].response;
                        } else {
                            road.distance = distance2;
                            correctRoadResponse = currentResponses[1].response;
                        }
                        mother.directionResponses = [];
                        //let duration = parseFloat(response.routes[0].legs[0].duration.value / 3600).toFixed(2);

                        let route_latlngs: string;
                        if (correctRoadResponse.routes) {
                            route_latlngs = correctRoadResponse.routes[0].overview_path;
                        } else {
                            route_latlngs = JSON.parse(correctRoadResponse);
                        }
                        mother.shortenAndShow(route_latlngs, road);
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
        if (overview_pathlatlngs) {
            var loading = document.getElementById('wait');
            loading.innerHTML = "";
            for (let marker of this.routeMarkers) {
                marker.setMap(null);
            }
            this.routeMarkers = [];
            this.routeMarkersLatLng = [];
            road.paths = [];
            for (let i = 0; i < overview_pathlatlngs.length; i++) {
                let lat = overview_pathlatlngs[i].lat;
                if (typeof lat !== "number") {
                    lat = overview_pathlatlngs[i].lat();
                }
                let lng = overview_pathlatlngs[i].lng;
                if (typeof lng !== "number") {
                    lng = overview_pathlatlngs[i].lng();
                }

                road.paths.push(new Coordinate(lat, lng));
                if (i == 0 || i == overview_pathlatlngs.length - 1) {
                    this.routeMarkersLatLng.push({ roadId: road.id, latLng: new google.maps.LatLng(lat, lng) });
                    let marker = this.createMaker('', new google.maps.LatLng(lat, lng), road, this.gmap.editMode);
                    this.routeMarkers.push(marker);
                }
                perimeterPoints.push(new google.maps.LatLng(lat, lng));
            }
        } else {
            road.paths.forEach(path => {
                perimeterPoints.push(new google.maps.LatLng(path.lat, path.lng));
            });
        }
        for (var i = 0; i < this.gmap.roads.length; i++) {
            if (this.gmap.roads[i].id == road.id) {
                this.gmap.roads[i] = road;
            }
        }
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
            strokeOpacity: 0.7,
            strokeWeight: 6
        });
        polyroadroute.set("id", road.id);
        let mother = this;
        polyroadroute.addListener('click', function (event) {
            let bounds = new google.maps.LatLngBounds();
           
            mother.routeMarkers.forEach(marker => {
                marker.setMap(null);
            });
            this.routeMarkers = [];
            if (overview_pathlatlngs) {
                mother.routeMarkersLatLng.forEach(marker => {
                    if (marker.roadId == road.id) {
                        let mark = mother.createMaker('', marker.latLng, road, mother.gmap.editMode);
                        mark.addListener('click', function () {
                            mother.showInfoWindow('', road, mark, marker);
                        });
                        bounds.extend(marker.latLng);
                        mother.routeMarkers.push(mark);
                    }
                });
            } else {
                for (var i = 0; i < road.paths.length; i++) {
                    if (i == 0 || i == (road.paths.length - 1)) {
                        let mark = mother.createMaker('', new google.maps.LatLng(road.paths[i].lat, road.paths[i].lng), road, mother.gmap.editMode);
                        mark.addListener('click', function () {
                            mother.showInfoWindow('', road, mark, { latLng: new google.maps.LatLng(road.paths[i - 1].lat, road.paths[i - 1].lng) });
                        });
                        mother.routeMarkers.push(mark);
                    }
                }
                bounds.extend(new google.maps.LatLng(road.paths[0].lat, road.paths[0].lng));
                bounds.extend(new google.maps.LatLng(road.paths[road.paths.length - 1].lat, road.paths[road.paths.length - 1].lng));

            }
            mother.showInfoWindow(`<b>Road ID:</b> ${road.id}<br><p><b>Road long</b>: ${road.distance} m<br>`,road, false, event);
            mother.gmap.controller.fitBounds(bounds);
        });
        polyroadroute.setMap(this.gmap.controller);
        //add to the array of road routes
        this.polyroadroutes.push(polyroadroute);
    }
    private showDetailPanel(road: Road, position: any){
        
    }
    private showInfoWindow(text, road, marker, markerLatLng) {
        let str: string;
        let mother = this;
        this.geocoder.geocode({
            'latLng': markerLatLng.latLng
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    if(marker)
                        str = `<p>${text}<br><b>Lat: </b>${ markerLatLng.latLng.lat()}<br><b>Lng: </b>${markerLatLng.latLng.lng()}<br><b>Location: </b>${results[0].formatted_address}</p>`;
                    else
                        str = text + `<b>Location</b>: ${results[0].formatted_address}</p>`;

                    let infowindow = new google.maps.InfoWindow({
                        content: str
                    });
                    if (marker) infowindow.open(mother.gmap.controller, marker);
                    else{
                        for(var infoWin of mother.inforWindows){
                            infoWin.setMap(null);
                        }
                        infowindow.setPosition(markerLatLng.latLng);
                        infowindow.open(mother.gmap.controller);
                        mother.inforWindows.push(infowindow);
                    }
                }
            }
        });
    }

    private createMaker(text: string, latlng: any, road: Road, isDraggable: boolean) {
        let marker = new google.maps.Marker({
            position: latlng,
            draggable: isDraggable,
            map: this.gmap.controller,
            title: text
        });
        marker.set("road", road);
        if (this.gmap.editMode) {
            marker.addListener('dragstart', function (event) {
                let lat = event.latLng.lat();
                let lng = event.latLng.lng();
                GLOBAL.oldMarker = new google.maps.LatLng(lat, lng);
                for(var infoWin of GLOBAL.GmapService.inforWindows){
                    infoWin.setMap(null);
                }
            })
            marker.addListener('dragend', function (event) {
                for(var infoWin of GLOBAL.GmapService.inforWindows){
                    infoWin.setMap(null);
                }
                let road = marker.get('road');
                let oldLatLng = GLOBAL.oldMarker;
                let oldLat = Math.round(oldLatLng.lat() * 100000) / 100000;
                let oldLng = Math.round(oldLatLng.lng() * 100000) / 100000;
                let newLat = event.latLng.lat();
                let newLng = event.latLng.lng();

                for (var i = 0; i < road.paths.length; i++) {
                    let lat = Math.round(road.paths[i].lat * 100000) / 100000;
                    let lng = Math.round(road.paths[i].lng * 100000) / 100000;
                    if (lat == oldLat && lng == oldLng) {
                        road.paths[i].lat = newLat;
                        road.paths[i].lng = newLng;
                        GLOBAL.oldMarker = null;
                        break;
                    }
                }
                var loading = document.getElementById('wait');
                loading.innerHTML = "<p><b><font size='4'>map processing, please wait ...</font></b><img src='https://loading.io/spinners/gears/index.dual-gear-loading-icon.svg' height='30' width='30'></p>";
                for (let polyroute of GLOBAL.GmapService.polyroadroutes) {
                    let id = polyroute.get('id');
                    if (id == road.id) {
                        polyroute.setMap(null);
                    }
                }
                GLOBAL.GmapService.drawRoute(road, true);
            })

        }
        return marker;
    }
}