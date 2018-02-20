import { Injectable } from '@angular/core';

import { JsonApiService } from '../../core/api/json-api.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { DataService } from 'app/core/services/data.service';
import { Constants } from 'app/constants';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {

  public user: Subject<any>;

  public userInfo = {
    username: 'Guest'
  };

  constructor(private dataService: HttpClient) {
    this.user = new Subject();
  }

  public getLoginInfo(): Observable<any> {
    return this.dataService.get(Constants.USER_INFO)
      .map((data) => (data['data'] || data))
      .do((user) => {
        this.userInfo.username = user['username'];
        this.user.next(user);
      });
    // return this.jsonApiService.fetch('/user/login-info.json')
    //   .do((user)=>{
    //     this.userInfo = user;
    //   this.user.next(user)
    // })
  }

}
