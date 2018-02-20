import {
    DynamicFormGroupModel,
    DynamicInputModel,
    DynamicCheckboxModel,
    DynamicSelectModel,
    DynamicDatePickerModel
} from '../../shared/form/core';
import { mathOther } from '../../shared/validators/match-other-validator.validator';
import { DynamicRowModel } from 'app/shared/form/core/model/row/dynamic-row.model';

export const REGISTER_FORM_MODEL = [
    new DynamicFormGroupModel({
        id: 'register',
        group: [
            new DynamicInputModel({
                id: 'username',
                name: 'username',
                placeholder: 'Username',
                icon: 'icon-append fa fa-user',
                hint: {
                    text: 'Need to enter the website',
                    position: 'bottom-right'
                },
                validators: {
                    required: null
                },
                errorMessages: {
                    required: 'Please enter username'
                }
            }),
            new DynamicInputModel({
                id: 'email',
                name: 'email',
                placeholder: 'Email address',
                icon: 'icon-append fa fa-envelope',
                inputType: 'email',
                hint: {
                    text: 'Need to verify your account',
                    position: 'bottom-right'
                },
                validators: {
                    required: null,
                    email: null
                },
                errorMessages: {
                    required: 'Please enter email',
                    email: 'Please enter a VALID email address'
                }
            }),
            new DynamicInputModel({
                id: 'password',
                name: 'password',
                placeholder: 'Password',
                icon: 'icon-append fa fa-lock',
                hint: {
                    text: 'Don\'t forget your password',
                    position: 'bottom-right'
                },
                inputType: 'password',
                validators: {
                    required: null
                },
                errorMessages: {
                    required: 'Please enter your username password'
                }
            }),
            new DynamicInputModel({
                id: 'confirmPassword',
                name: 'confirmPassword',
                placeholder: 'Confirm password',
                icon: 'icon-append fa fa-lock',
                hint: {
                    text: 'Don\'t forget your password',
                    position: 'bottom-right'
                },
                inputType: 'password',
                validators: {
                    required: null,
                    matchOther: {
                        name: mathOther.name,
                        args: 'register.password'
                    }
                },
                errorMessages: {
                    required: 'Please enter your username confirm password',
                    matchOther: 'Password mismatch'
                }
            })
        ]
    }),
    new DynamicFormGroupModel({
        id: 'userInfo',
        group: [
            new DynamicRowModel({
                id: 'ui',
                group: [
                    new DynamicInputModel({
                        id: 'firstName',
                        name: 'firstName',
                        placeholder: 'First name',
                        validators: {
                            required: null
                        },
                        errorMessages: {
                            required: 'Please select your first name'
                        }
                    }),
                    new DynamicInputModel({
                        id: 'lastName',
                        name: 'lastName',
                        placeholder: 'Last name',
                        validators: {
                            required: null
                        },
                        errorMessages: {
                            required: 'Please select your last name'
                        }
                    })
                ]
            }),
            new DynamicRowModel({
                id: 'other',
                group: [
                    new DynamicSelectModel({
                        id: 'gender',
                        name: 'gender',
                        options: [
                            {
                                label: 'Gender',
                                value: '0',
                                disabled: true
                            },
                            {
                                label: 'Male',
                                value: 'male'
                            },
                            {
                                label: 'Female',
                                value: 'female'
                            },
                            {
                                label: 'Other',
                                value: 'other'
                            }
                        ],
                        value: '0'
                    }),
                    new DynamicDatePickerModel({
                        id: 'request',
                        name: 'request',
                        min: Date.now().toString(),
                        placeholder: 'Request activation on',
                        value: new Date()
                    }, {
                        grid: {
                            control: 'col col-6'
                        }
                    })
                ]
            }),
            new DynamicCheckboxModel({
                id: 'subscription',
                name: 'subscription',
                label: 'I want to receive news and special offers'
            }),
            new DynamicCheckboxModel({
                id: 'termsAgreed',
                name: 'termsAgreed',
                // tslint:disable-next-line:max-line-length
                label: 'I agree with the <a href="#" (click)="openModal($event, termsModal)"> Terms and Conditions </a>'
            })
        ]
    })
];
