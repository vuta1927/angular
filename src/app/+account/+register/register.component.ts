// import { Component, OnInit } from '@angular/core';
// import { FormGroup } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';

// import { DataService } from '../../core/services/data.service';
// import { Constants } from '../../constants';
// import {
//   DynamicFormControlModel,
//   DynamicFormService,
//   DynamicFormLayout
// } from '../../shared/form/core';
// import { REGISTER_FORM_MODEL } from './register.model';
// import { REGISTER_FORM_LAYOUT } from 'app/+account/+register/register.layout';

// @Component({
//   selector: 'app-register',
//   templateUrl: './register.component.html'
// })
// export class RegisterComponent implements OnInit {

//   public formModel: DynamicFormControlModel[] = REGISTER_FORM_MODEL;
//   public formGroup: FormGroup;
//   public formLayout: DynamicFormLayout = REGISTER_FORM_LAYOUT;

//   constructor(
//     private dataService: DataService,
//     private formService: DynamicFormService,
//     private router: Router,
//     private route: ActivatedRoute) {}

//   public ngOnInit() {
//     this.formGroup = this.formService.createFormGroup(this.formModel);
//   }

//   public register(model) {
//     this.dataService.post(Constants.REGISTER)
//       .subscribe((res: Response) => {
//         this.router.navigate(['../registerconfirmation'],
//           { relativeTo: this.route, queryParams: { emailConfirmed: true }});
//       });
//   }
// }
