import { Component, OnInit } from '@angular/core';
import { forEach } from '@angular/router/src/utils/collection';
import { DataService } from '../core/services/data.service';
import { Response } from '@angular/http/src/static_response';
import { Constants } from '../constants';
import { AuthService } from '../core/services/auth.service';
import { GmapService } from './services/gmap.service';
import { Road } from './models/Road';
declare let google: any;
@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css'],
    providers: [GmapService, AuthService]
})
export class MapComponent implements OnInit {
    constructor(private dataService: DataService, private gmapService: GmapService, private authService: AuthService) {
    }

    public ngOnInit() {
        let test = this.authService.getClaim();
        console.log(test);
        this.dataService.get("http://localhost:51636/api/maps").subscribe((res: Response) => {
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