import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { OAuthService } from 'angular-oauth2-oidc';
import { UtilityService } from '../../core/services/utility.service';
import {
  DynamicFormControlModel,
  DynamicFormService
} from '../../shared/form/core';
import { LOGIN_FORM_MODEL } from 'app/+account/+login/login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;

  public formModel: DynamicFormControlModel[] = LOGIN_FORM_MODEL;
  public formGroup: FormGroup;

  public isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private formService: DynamicFormService,
    public oAuthService: OAuthService,
    public utilityService: UtilityService
  ) {
    if (this.oAuthService.hasValidAccessToken()) {
      this.utilityService.navigateToReturnUrl();
    }
  }

  public ngOnInit() {
    this.formGroup = this.formService.createFormGroup(this.formModel);
  }

  public login(): void {
    // this.oAuthService.initImplicitFlow(null, {
    //   provider: 'Google', redirect_uri: 'http://google.com'});
    // this.formService.validateAllFormFields(this.formGroup);
    // this.isLoading = true;
    // if (this.formGroup.valid) {

    //   this.oAuthService.fetchTokenUsingPasswordFlow(
    //     this.formGroup.value.login.email,
    //     this.formGroup.value.login.password)
    //       .then(() => {
    //         this.isLoading = false;
    //         this.formGroup.reset();
    //         this.oAuthService.setupAutomaticSilentRefresh();
    //         this.utilityService.navigateToReturnUrl();
    //       })

    //       .catch((err) => {
    //         this.isLoading = false;
    //         console.error('error logging in', err);
    //       });
    // }
  }
}
