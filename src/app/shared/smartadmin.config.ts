export const config: any = {

  defaultLocale: 'us',

  API_URL: 'assets/api',

  menu_speed: 200,

  smartSkin: 'smart-style-6',

  skins: [
    {
      name: 'smart-style-0',
      logo: 'assets/img/logo.png',
      skinBtnClass: 'btn btn-block btn-xs txt-color-white margin-right-5',
      style: {
        backgroundColor: '#4E463F'
      },
      label: 'Smart Default'
    },

    {
      name: 'smart-style-1',
      logo: 'assets/img/logo-white.png',
      skinBtnClass: 'btn btn-block btn-xs txt-color-white',
      style: {
        background: '#3A4558'
      },
      label: 'Dark Elegance'
    },

    {
      name: 'smart-style-2',
      logo: 'assets/img/logo-blue.png',
      skinBtnClass: 'btn btn-xs btn-block txt-color-darken margin-top-5',
      style: {
        background: '#fff'
      },
      label: 'Ultra Light'
    },

    {
      name: 'smart-style-3',
      logo: 'assets/img/logo-pale.png',
      skinBtnClass: 'btn btn-xs btn-block txt-color-white margin-top-5',
      style: {
        background: '#f78c40'
      },
      label: 'Google Skin'
    },

    {
      name: 'smart-style-4',
      logo: 'assets/img/logo-pale.png',
      skinBtnClass: 'btn btn-xs btn-block txt-color-white margin-top-5',
      style: {
        background: '#bbc0cf',
        border: '1px solid #59779E',
        color: '#17273D !important'
      },
      label: 'PixelSmash'
    },

    {
      name: 'smart-style-5',
      logo: './assets/img/logo-pale.png',
      skinBtnClass: 'btn btn-xs btn-block txt-color-white margin-top-5',
      style: {
        background: 'rgba(153, 179, 204, 0.2)',
        border: '1px solid rgba(121, 161, 221, 0.8)',
        color: '#17273D !important'
      },
      label: 'Glass'
    },

    {
      name: 'smart-style-6',
      logo: './assets/img/logo-pale.png',
      skinBtnClass: 'btn btn-xs btn-block txt-color-white margin-top-6',
      style: {
        background: '#2196F3',
        border: '1px solid rgba(0, 0, 0, .3)',
        color: '#FFF !important;'
      },
      label: 'MaterialDesign'
    }

  ],

  GOOGLE_API_KEY: 'AIzaSyDd8YW8k_J-Jkti-W4QNk5dL8O_5_2QUWY',

  /**
   * DEBUGGING MODE
   * debugState = true; will spit all debuging message inside browser console.
   * The colors are best displayed in chrome browser.
   */

  debugState: false,
  debugStyle: 'font-weight: bold; color: #00f;',
  debugStyle_green: 'font-weight: bold; font-style:italic; color: #46C246;',
  debugStyle_red: 'font-weight: bold; color: #ed1c24;',
  debugStyle_warning: 'background-color:yellow',
  debugStyle_success: 'background-color:green; font-weight:bold; color:#fff;',
  debugStyle_error: 'background-color:#ed1c24; font-weight:bold; color:#fff;',
};
