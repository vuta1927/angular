import { Injectable } from '@angular/core';
import { Constants } from 'app/constants';
import { forEach } from '@angular/router/src/utils/collection';
import { GMap } from '../models/Map';
import { Road, Coordinate, MetaData } from '../models/Road';
import { UtilityService } from '../../core/services/utility.service';
import { FormsModule } from '@angular/forms';
import { Handler } from 'tapable';
declare let google: any;
declare var jquery: any;
declare var $: any;
let GLOBAL = {
    snapPoints: [],
    GmapService: null,
    isSnapEnable: false,
    oldMarker: null,
    isRoadsTableEnable: false,
    gmapTimer: null,
    addIconPoint: false
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
    descriptions = [];
    directionResponses: any; // bien luu tru 2 tuyen duong kha thi giua 2 toa do
    myIcon = {
        camera: 'https://cdn3.iconfinder.com/data/icons/wpzoom-developer-icon-set/500/41-20.png',
        info: 'https://cdn2.iconfinder.com/data/icons/basic-ui-25/64/x-43-20.png'
    }
    constructor(private utilityService: UtilityService) { }

    public initGoogleMap(obj) {
        this.gmap = obj;

        this.directionsService = new google.maps.DirectionsService();
        this.directionsDisplay = new google.maps.DirectionsRenderer();

        this.gmap.controller = new google.maps.Map(document.getElementById('gmap'), {
            center: { lat: 21.027884, lng: 105.833974 },
            zoom: 7,
            gestureHandling: 'greedy',
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.VERTICAL_BAR, //HORIZONTAL_BAR,
                position: google.maps.ControlPosition.RIGHT_TOP
            },
            fullscreenControlOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM
            }

        });
        if (this.gmap.roads.length && this.gmap.roads.length > 0) {
            var bounds = new google.maps.LatLngBounds();
            this.gmap.roads.forEach(function (road) {
                bounds.extend(new google.maps.LatLng(road.paths[0].lat, road.paths[0].lng));
                bounds.extend(new google.maps.LatLng(road.paths[road.paths.length - 1].lat, road.paths[road.paths.length - 1].lng));
            });
            // this.gmap.controller.fitBounds(bounds);
            var temp = bounds.getCenter();
            this.gmap.controller.setCenter(temp);
            this.gmap.controller.setZoom(17);
        }
        GLOBAL.GmapService = this;

        let mother = this;
        this.gmap.controller.addListener('click', function (event) {
            if (!GLOBAL.isSnapEnable) {
                for (let i = 0; i < mother.routeMarkers.length; i++) {
                    mother.routeMarkers[i].setMap(null);
                }
            }
            for (var i = 0; i < mother.inforWindows.length; i++) {
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
        this.initPanelControl();
    }

    private setCenter(lat: number, lng: number) {
        this.gmap.controller.setOptions({
            center: {
                lat,
                lng
            }
        });
    }

    private addDescription(src, text) {
        this.descriptions.push({
            icon: src,
            desc: text
        });
        var desControl = document.getElementById('gmap-description');
        desControl.style.display = 'block';
        desControl.style.fontSize = '14px';
        desControl.innerHTML = `${this.descriptions.map(d => `&nbsp<a style="font-size:14px">
        <img src=${d.icon} width="15" height="15"> 
        </a>${d.desc}`)}
        `;
    }

    private initPanelControl() {
        this.gmap.controller.controls[google.maps.ControlPosition.LEFT_TOP].push(document.getElementById('gmap-btnShowDetail'));
        this.gmap.controller.controls[google.maps.ControlPosition.TOP_CENTER].push(document.getElementById('gmap-description'));
        this.gmap.controller.controls[google.maps.ControlPosition.LEFT_TOP].push(document.getElementById('gmap-ctrl1'));
        this.gmap.controller.controls[google.maps.ControlPosition.RIGHT_TOP].push(document.getElementById('gmap-ctrl2'));
        this.gmap.controller.controls[google.maps.ControlPosition.TOP_CENTER].push(document.getElementById('gmap-ctrl3'));
        document.getElementById('gmap-DialogContainer').style.display = 'none';
        if (this.descriptions.length < 1) {
            document.getElementById('gmap-description').style.display = 'none';
        }

        document.getElementById('gmap-resetView').addEventListener('click', function () {
            let bounds = new google.maps.LatLngBounds();
            GLOBAL.GmapService.gmap.roads.forEach(road => {
                bounds.extend(new google.maps.LatLng(road.paths[0].lat, road.paths[0].lng));
                bounds.extend(new google.maps.LatLng(road.paths[road.paths.length - 1].lat, road.paths[road.paths.length - 1].lng));
            });
            GLOBAL.GmapService.routeMarkers.forEach(marker => {
                marker.setMap(null);
            });
            GLOBAL.GmapService.gmap.controller.fitBounds(bounds);
            var table = document.getElementById("gmapRoadsTable");
            for (var i = 0, row; row = table.rows[i]; i++) {
                row.style.backgroundColor = '#fff';
            }
            GLOBAL.GmapService.inforWindows.forEach(function (infoWin) {
                infoWin.setMap(null);
            })
        });

        var mother = this;

        document.getElementById('gmap-ctrl3').style.display = 'none';
        var addIconPointControl = document.getElementById('gmap-addIconPoint');
        if (!this.gmap.editMode) {
            addIconPointControl.style.display = 'none';
        }
        addIconPointControl.addEventListener('click', function () {
            if (!GLOBAL.addIconPoint) {
                GLOBAL.addIconPoint = true;
                document.getElementById('gmap-ctrl3').style.display = 'block';
                document.getElementById('gmap-ctrl3').innerHTML = `<p><strong>Please click on route where you want to add icon ...</strong></p>`;
            } else {
                document.getElementById('gmap-ctrl3').style.display = 'none';
                document.getElementById('gmap-ctrl3').innerHTML = ``;
                GLOBAL.addIconPoint = false;
            }
        });

        var setPointControl = document.getElementById('gmap-setPoint');

        if (this.gmap.editMode) {
            document.getElementById('gmap-setPoint').style.display = 'block';
        } else {
            document.getElementById('gmap-setPoint').style.display = 'none';
        }
        setPointControl.addEventListener('click', function (event) {
            if (GLOBAL.isSnapEnable) {
                GLOBAL.GmapService.gmap.controller.setOptions({ draggableCursor: 'default' });
                GLOBAL.isSnapEnable = false;
                return;
            }
            GLOBAL.isSnapEnable = true;
            GLOBAL.GmapService.gmap.controller.setOptions({ draggableCursor: 'crosshair' });
        });

        this.gmap.controller.addListener('click', function (event) {
            var table = document.getElementById("gmapRoadsTable");
            for (var i = 0, row; row = table.rows[i]; i++) {
                row.style.backgroundColor = '#fff';
            }
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
                        let newRoad = new Road(
                            GLOBAL.GmapService.polyroadroutes.length + 1,
                            [
                                new Coordinate(GLOBAL.snapPoints[0].lat(), GLOBAL.snapPoints[0].lng()),
                                new Coordinate(GLOBAL.snapPoints[GLOBAL.snapPoints.length - 1].lat(), GLOBAL.snapPoints[GLOBAL.snapPoints.length - 1].lng())
                            ],
                            0,
                            "",
                            new MetaData()
                        );
                        GLOBAL.GmapService.gmap.roads.push(newRoad);
                        var loading = document.getElementById('gmap-wait');
                        loading.innerHTML = "<p><b><font size='3'>Processing, please wait ......</font></b><img src='https://loading.io/spinners/gears/index.dual-gear-loading-icon.svg' height='30' width='30'></p>";
                        GLOBAL.GmapService.drawRoute(newRoad, GLOBAL.GmapService.drawMode.SnapMode);
                        GLOBAL.snapPoints = [];
                    }
                }
            }
            // GLOBAL.GmapService.createMaker('(lat: '+event.latLng.lat()+'; lng: '+event.latLng.lng()+')', event.latLng);
        });


        document.getElementById('gmap-ctrl1').style.display = 'none';
        var buttonControl = document.getElementById('gmap-btnShowDetail');
        var searchPanel = document.getElementById('gmap-searchPanel');

        var mother = this;
        buttonControl.addEventListener('click', function () {
            if (!GLOBAL.isRoadsTableEnable) {
                let gmapControl = document.getElementById('gmap-ctrl1');
                gmapControl.style.display = 'block';
                GLOBAL.isRoadsTableEnable = true;
            } else {
                let gmapControl = document.getElementById('gmap-ctrl1');
                gmapControl.style.display = 'none';
                GLOBAL.isRoadsTableEnable = false;
            }
        });

        var resultContext = document.createElement('p');
        resultContext.id = 'gmap-resultsCount';
        resultContext.innerText = 'Search results: 0';
        resultContext.style.fontWeight = 'bold';
        resultContext.style.fontSize = '11pt';
        resultContext.style.marginTop = '10px';
        resultContext.style.marginBottom = '10px';
        resultContext.align = 'center';
        searchPanel.appendChild(resultContext);
        mother.bindingTable(GLOBAL.GmapService.gmap.roads);

        if (!window.matchMedia('screen and (max-width: 768px)').matches) {
            var gmapControl = document.getElementById('gmap-ctrl1');
            document.getElementById("gmap-searchPanel").style.width = '300px';
            document.getElementById("gmapRoadTableDiv").style.width = '300px';
            gmapControl.style.display = 'block';
            GLOBAL.isRoadsTableEnable = true;
        }

        // document.getElementById('gmap-btnSearchEraser').addEventListener("click", function (event) {
        //     $('gmap-txtSearch').val(''); //document.getElementById('gmap-txtSearch').value = '';
        //     var table = document.getElementById('gmapRoadsTable');
        //     table.style.cursor = 'pointer';
        //     var theadEl = table.getElementsByTagName('thead')[0];
        //     var tbody = table.getElementsByTagName('tbody')[0];
        //     tbody.innerHTML = '';
        //     theadEl.innerHTML = '';
        //     mother.bindingTable(mother.gmap.roads);
        // });
        
        document.getElementById('gmap-txtSearch').addEventListener("keyup", function (event) {
            document.getElementById('gmap-resultsCount').innerHTML = "Searching ...... <img src='https://loading.io/spinners/gears/index.dual-gear-loading-icon.svg' height='25' width='25'>";
            clearTimeout(GLOBAL.gmapTimer);
            var ms = 1000; // milliseconds
            var val = $('#gmap-txtSearch').val();//document.getElementById('gmap-txtSearch').value;
            GLOBAL.gmapTimer = setTimeout(function () {
                var results = [];
                var table = document.getElementById('gmapRoadsTable');
                table.style.cursor = 'pointer';
                var theadEl = table.getElementsByTagName('thead')[0];
                var tbody = table.getElementsByTagName('tbody')[0];
                tbody.innerHTML = '';
                theadEl.innerHTML = '';


                var roads = GLOBAL.GmapService.gmap.roads;
                if (!val) {
                    results = roads;
                } else {
                    for (var i = 0; i < roads.length; i++) {
                        if (roads[i].metaData.direction.value.indexOf(val) != -1 || roads[i].metaData.direction.display.indexOf(val) != -1) {
                            results.push(roads[i]);
                        }
                    }
                    if (results.length < 1) {
                        document.getElementById('gmap-resultsCount').innerHTML = "No result found.";

                        return;
                    }
                }

                mother.bindingTable(results);
                // resultsControl.innerHTML = results;
            }, ms);
        });

    }

    private bindingTable(data) {
        var resultContext = document.getElementById('gmap-resultsCount');
        resultContext.innerHTML = '';
        var table = document.getElementById('gmapRoadsTable');
        table.style.cursor = 'pointer';
        var theadEl = table.getElementsByTagName('thead')[0];
        var tbody = table.getElementsByTagName('tbody')[0];
        tbody.innerHTML = '';
        var th1 = document.createElement('th');
        th1.innerHTML = '';
        th1.width = '40px';
        theadEl.appendChild(th1);
        var th2 = document.createElement('th');
        // th2.innerHTML = "Direction";
        theadEl.appendChild(th2);
        var mother = this;
        data.forEach(function (road) {
            var newRow = tbody.insertRow(tbody.rows.length);

            newRow.insertCell(0).innerHTML = '<img id="detail-icon-img" src="https://cdn1.iconfinder.com/data/icons/free-98-icons/32/map-marker-20.png" alt="map, marker icon" width="15" height="15">';
            newRow.insertCell(1).innerHTML = String(road.metaData.direction.display);
            newRow.cells[0].align = 'center';
            newRow.cells[0].vAlign = 'middle';
            newRow.addEventListener('click', function (event) {
                //console.log(road.id);
                var table = document.getElementById("gmapRoadsTable");
                for (var i = 0, row; row = table.rows[i]; i++) {
                    row.style.backgroundColor = '#fff';
                }
                this.style.backgroundColor = '#ddd';
                var bounds = new google.maps.LatLngBounds();
                for (var j = 0, path = road.paths; j < path.length; j++) {
                    var latLng = path[j];
                    bounds.extend(latLng);
                }
                var polyroutes = GLOBAL.GmapService.polyroadroutes;
                polyroutes.forEach(function (route) {
                    var id = route.get('id');
                    if (id == road.id) {
                        GLOBAL.GmapService.routeMarkers.forEach(function (marker) {
                            marker.setMap(null);
                        });
                        if (mother.gmap.editMode) {
                            if (i == 0 || i == road.paths.length - 1) {
                                var mark = GLOBAL.GmapService.createMaker('', new google.maps.LatLng(road.paths[i].lat, road.paths[i].lng), road, mother.gmap.editMode);
                                mark.addListener('click', function () {
                                    mother.showInfoWindow('', road, mark, {
                                        latLng: new google.maps.LatLng(road.paths[i].lat, road.paths[i].lng)
                                    });
                                });
                                mother.routeMarkers.push(mark);
                            }
                            // for (var i = 0; i < road.paths.length; i++) {
                            //     _loop_1();
                            // }
                        }

                        var rndNumber = Math.floor((Math.random() * (road.paths.length - 2)) + 1);
                        var latLngs = {
                            latLng: new google.maps.LatLng(road.paths[rndNumber].lat, road.paths[rndNumber].lng)
                        };
                        GLOBAL.GmapService.showInfoWindow("", road, false, latLngs);
                    }
                });
                var temp = bounds.getCenter();
                GLOBAL.GmapService.gmap.controller.setCenter(temp);
                GLOBAL.GmapService.gmap.controller.setZoom(17);
            });
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
        var perimeterPoints = Array();
        //loop through each leg of the route
        if (overview_pathlatlngs) {
            var loading = document.getElementById('gmap-wait');
            loading.innerHTML = "";
            for (var i = 0, _a = this.routeMarkers; i < _a.length; i++) {
                var marker = _a[i];
                marker.setMap(null);
            }
            this.routeMarkers = [];
            this.routeMarkersLatLng = [];
            road.paths = [];
            for (var j = 0; j < overview_pathlatlngs.length; j++) {
                var lat = overview_pathlatlngs[j].lat;
                if (typeof lat !== "number") {
                    lat = overview_pathlatlngs[j].lat();
                }
                var lng = overview_pathlatlngs[j].lng;
                if (typeof lng !== "number") {
                    lng = overview_pathlatlngs[j].lng();
                }
                road.paths.push(new Coordinate(lat, lng));
                if (j == 0 || j == overview_pathlatlngs.length - 1) {
                    this.routeMarkersLatLng.push({
                        roadId: road.id,
                        latLng: new google.maps.LatLng(lat, lng)
                    });
                    var marker = this.createMaker('', new google.maps.LatLng(lat, lng), road, this.gmap.editMode);
                    this.routeMarkers.push(marker);
                }
                perimeterPoints.push(new google.maps.LatLng(lat, lng));
            }
        } else {
            road.paths.forEach(function (path) {
                perimeterPoints.push(new google.maps.LatLng(path.lat, path.lng));
            });
        }

        if (!road.metaData.direction) {
            this.geocoder.geocode({
                'latLng': perimeterPoints[0]
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        var newDirect = {
                            display: results[0].formatted_address,
                            value: results[0].formatted_address
                        };
                        road.metaData.direction = newDirect;
                    }
                }
            });
        }

        var color;
        if (road.color == "") {
            color = this.utilityService.getRandomColor();
        } else {
            color = road.color;
        }
        var polyroadroute = new google.maps.Polyline({
            path: perimeterPoints,
            geodesic: true,
            strokeColor: color,
            strokeOpacity: 0.7,
            strokeWeight: 6
        });
        polyroadroute.set("id", road.id);
        var mother = this;
        polyroadroute.addListener('click', function (event) {
            if (GLOBAL.addIconPoint) {
                // var symbolOne = {
                //     path: 'M 0 6 L 0 26 L 24 26 L 24 19 L 32 23 L 32 9 L 24 13 L 24 6 Z',
                //     fillColor: '#000',
                //     strokeColor: '#000',
                //     scale: 0.5,
                //     fillOpacity: 1,
                //     anchor: new google.maps.Point(17, 17)
                // };
                document.getElementById('gmap-DialogContainer').style.display = 'block';
                let dialog = $("#gmap-AddIconDialog").dialog({
                    autoOpen: false,
                    // height: 400,
                    width: 400,
                    resizable: false,
                    modal: true,
                    closeText: '',
                    title : "Add Icon",
                    buttons: {
                        "Add Icon": function () {
                            mother.addIconOnRouteProcess(road, event.latLng);
                            dialog.dialog("close");
                            GLOBAL.addIconPoint = false;
                            document.getElementById('gmap-ctrl3').innerHTML = '';
                            document.getElementById('gmap-ctrl3').style.display = 'none';
                        },
                        Cancel: function () {
                            GLOBAL.addIconPoint = false;
                            document.getElementById('gmap-ctrl3').innerHTML = '';
                            document.getElementById('gmap-ctrl3').style.display = 'none';
                            dialog.dialog("close");
                        }
                    },
                    close: function () {
                    }
                });

                var form = dialog.find("form");
                dialog.dialog("open");
            } else {
                var bounds = new google.maps.LatLngBounds();
                mother.routeMarkers.forEach(function (marker) {
                    marker.setMap(null);
                });
                this.routeMarkers = [];
                if (overview_pathlatlngs) {
                    mother.routeMarkersLatLng.forEach(function (marker) {
                        if (marker.roadId == road.id) {
                            var mark = mother.createMaker('', marker.latLng, road, mother.gmap.editMode);
                            mark.addListener('click', function () {
                                mother.showInfoWindow('', road, mark, marker);
                            });
                            bounds.extend(marker.latLng);
                            mother.routeMarkers.push(mark);
                        }
                    });
                    overview_pathlatlngs = null;
                } else {
                    if (mother.gmap.editMode) {
                        var mark1 = mother.createMaker('', new google.maps.LatLng(road.paths[0].lat, road.paths[0].lng), road, mother.gmap.editMode);
                        mark1.addListener('click', function () {
                            mother.showInfoWindow('', road, mark1, {
                                latLng: new google.maps.LatLng(road.paths[0].lat, road.paths[0].lng)
                            });
                        });
                        var mark2 = mother.createMaker('', new google.maps.LatLng(road.paths[road.paths.length - 1].lat, road.paths[road.paths.length - 1].lng), road, mother.gmap.editMode);
                        mark2.addListener('click', function () {
                            mother.showInfoWindow('', road, mark2, {
                                latLng: new google.maps.LatLng(road.paths[road.paths.length - 1].lat, road.paths[road.paths.length - 1].lng)
                            });
                        });
                        mother.routeMarkers.push(mark1);
                        mother.routeMarkers.push(mark2);
                    }
                }
                mother.showInfoWindow("", road, false, event);
            }
            // bounds.extend(new google.maps.LatLng(road.paths[0].lat, road.paths[0].lng));
            // bounds.extend(new google.maps.LatLng(road.paths[road.paths.length - 1].lat, road.paths[road.paths.length - 1].lng));
            // mother.gmap.controller.fitBounds(bounds);
        });

        var roadIds = [];
        for (var i = 0; i < this.gmap.roads.length; i++) {
            roadIds.push(this.gmap.roads[i].id);
            if (this.gmap.roads[i].id == road.id) {
                this.gmap.roads[i] = road;
            }
        }
        var isExist = false;
        for (var i = 0; i < roadIds.length; i++) {
            if (roadIds[i] == road.id) {
                isExist = true;
                break;
            }
        }
        if (!isExist) {
            this.gmap.roads.push(road);

        }

        polyroadroute.setMap(this.gmap.controller);
        //add to the array of road routes
        this.polyroadroutes.push(polyroadroute);
        setTimeout(function () {
            var table = document.getElementById('gmapRoadsTable');
            table.style.cursor = 'pointer';
            var theadEl = table.getElementsByTagName('thead')[0];
            var tbody = table.getElementsByTagName('tbody')[0];
            tbody.innerHTML = '';
            theadEl.innerHTML = '';
            document.getElementById('gmap-resultsCount').innerHTML = "Searching ...... <img src='https://loading.io/spinners/gears/index.dual-gear-loading-icon.svg' height='25' width='25'>";
            mother.bindingTable(mother.gmap.roads);
        }, 500);
    }

    private addIconOnRouteProcess(road, latLng) {
        var iconType = $('#gmap-iconType').val();// document.getElementById("gmap-iconType").value;
        var desct = $('#gmap-addIconDesct').val(); // document.getElementById("gmap-addIconDesct").value;

        if (!road.metaData.icons) {
            road.metaData.icons = [];
        }
        var image = {
            anchor: new google.maps.Point(10, 10), //16: center of 32x32 image
            origin: new google.maps.Point(0, 0),
            scaledSize: new google.maps.Size(20, 20),
            size: new google.maps.Size(20, 20),
            url: this.myIcon[iconType]
        };
        GLOBAL.addIconPoint = false;
        this.routeMarkers.forEach(marker => {
            marker.setMap(null);
        });
        var iconMark = new google.maps.Marker({
            position: latLng,
            draggable: true,
            map: this.gmap.controller,
            icon: image,
            // anchor: new google.maps.Point(5, 30)
        });
        var mother = this;
        iconMark.addListener('click', function (event) {
            var lat = event.latLng.lat();
            var lng = event.latLng.lng();
            mother.showInfoWindow(desct, road, this, event);
        })
        document.getElementById('gmap-ctrl3').innerHTML = '';
        document.getElementById('gmap-ctrl3').style.display = 'none';
    }

    private showInfoWindow(text, road, marker, markerLatLng) {
        var str;
        var mother = this;
        this.geocoder.geocode({
            'latLng': markerLatLng.latLng
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    var newDirect = {
                        display: results[0].formatted_address,
                        value: results[0].formatted_address
                    };
                    road.metaData.direction = newDirect;
                    if (marker)
                        str = `<div class="row" style="margin-left: 5px">
                        <div><p><strong>${text}</strong></p>
                        <table class="table talbe-sm" >
                            <tr>
                                <th>Location</th>
                                <td>${results[0].formatted_address}</td>
                            </tr>
                            <tr>
                                <th>Lat</th>
                                <td>${markerLatLng.latLng.lat()}</td>
                            </tr>
                            <tr>
                                <th>Lng</th>
                                <td>${markerLatLng.latLng.lng()}</td>
                            </tr>
                        </table></div></div>`;//"<p>" + text + "<br><b>Lat: </b>" + markerLatLng.latLng.lat() + "<br><b>Lng: </b>" + markerLatLng.latLng.lng() + "<br><b>Location: </b>" + results[0].formatted_address + "</p>";
                    else {
                        str = `<div class="row" style="margin-left: 5px"><div><p><strong>${text}</strong></p><table class="table" >
                                <tr><th>Location</th><td>${results[0].formatted_address}</td></tr><tr><th>Direction</th><td>${road.metaData.direction.display}</td></tr>
                        </table></div></div>`;//" <b>Location</b>: " + results[0].formatted_address + "<br><b>Direction: </b>" + road.metaData.direction.display + "<br></p>";
                    }
                    var infowindow = new google.maps.InfoWindow({
                        content: str,maxWidth: 200
                    });
                    mother.inforWindows.forEach(inforwin => {
                        inforwin.setMap(null);
                    });
                    if (marker)
                        infowindow.open(mother.gmap.controller, marker);
                    else {
                        for (var _i = 0, _a = mother.inforWindows; _i < _a.length; _i++) {
                            var infoWin = _a[_i];
                            infoWin.setMap(null);
                        }
                        infowindow.setPosition(markerLatLng.latLng);
                        infowindow.open(mother.gmap.controller);
                    }
                    mother.inforWindows.push(infowindow);
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
                for (var infoWin of GLOBAL.GmapService.inforWindows) {
                    infoWin.setMap(null);
                }
            })
            marker.addListener('dragend', function (event) {
                for (var infoWin of GLOBAL.GmapService.inforWindows) {
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
                var loading = document.getElementById('gmap-wait');
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