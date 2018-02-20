import { DynamicFormGroupModel } from 'app/core/form/models/dynamic-form-group.model';
import { DynamicInputModel } from 'app/core/form/models/controls/dynamic-input.model';
import { DynamicCheckboxModel } from 'app/core/form/models/controls/dynamic-checkbox.model';

export const LOGIN_FORM_MODEL = [
    new DynamicFormGroupModel({
        id: 'login',
        group: [
            new DynamicInputModel({
                id: 'email',
                name: 'email',
                label: 'E-mail',
                icon: 'icon-append fa fa-user',
                inputType: 'email',
                hint: {
                    position: 'top-right',
                    text: 'Please enter email address/username',
                    icon: 'fa fa-user txt-color-teal'
                },
                validators: {
                    required: null,
                    email: null
                },
                errorMessages: {
                    required: 'Please enter your email address',
                    email: 'Please enter a VALID email address'
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
