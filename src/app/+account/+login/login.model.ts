import {
    DynamicFormGroupModel,
    DynamicInputModel,
    DynamicCheckboxModel
} from '../../shared/form/core';

export const LOGIN_FORM_MODEL = [
    new DynamicFormGroupModel({
        id: 'login',
        group: [
            new DynamicInputModel({
                id: 'email',
                name: 'email',
                label: 'E-mail',
                icon: 'icon-append fa fa-user',
                inputType: 'text',
                hint: {
                    position: 'top-right',
                    text: 'Please enter email address/username',
                    icon: 'fa fa-user txt-color-teal'
                },
                validators: {
                    required: null
                },
                errorMessages: {
                    required: 'Please enter your email address'
                }
            }),
            new DynamicInputModel({
                id: 'password',
                label: 'Password',
                icon: 'icon-append fa fa-lock',
                inputType: 'password',
                hint: {
                    position: 'top-right',
                    text: 'Enter your password',
                    icon: 'fa fa-lock txt-color-teal'
                },
                validators: {
                    required: null
                },
                errorMessages: {
                    required: 'Please enter your email password'
                }
            }),
            new DynamicCheckboxModel({
                name: 'rememberMe',
                id: 'rememberMe',
                label: 'Stay signed in',
                value: true
            })
        ]
    })
];
