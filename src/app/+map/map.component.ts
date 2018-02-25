import { Component, OnInit } from '@angular/core';
import { forEach } from '@angular/router/src/utils/collection';
import { DataService } from '../core/services/data.service';
import { Response } from '@angular/http/src/static_response';
import { Constants } from '../constants';
import { GmapService } from './services/gmap.service';
declare let google: any;
@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css'],
    providers: [GmapService]
})
export class MapComponent implements OnInit {
    constructor(private dataService: DataService, private gmapService: GmapService) {
    }

    public ngOnInit() {
        this.dataService.get("http://localhost:51375/api/map").subscribe((res: Response) => {
            // console.log(res);
            if (res["roads"].length > 0) {
                if (res["type"] == Constants.mapType.Google)
                this.gmapService.initGoogleMap(res);
            } else {
                console.log("error! no data!");
            }
        }, error => console.log(error));
    }   
}