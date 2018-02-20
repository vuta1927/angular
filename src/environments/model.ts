import { NgModuleRef } from '@angular/core';

export interface Environment {
  production: boolean;
  API_BASE_ENDPOINT: string;
  API_ENDPOINT: string;
  defaultLanguage: any;
  ENV_PROVIDERS: any;
  showDevModule: boolean;
  decorateModuleRef(modRef: NgModuleRef<any>): NgModuleRef<any>;
}
