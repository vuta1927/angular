import { OnDestroy, Injectable } from '@angular/core';

import { config } from '../smartadmin.config';
import { Observable, Subject } from 'rxjs/Rx';
import { NotificationService } from '../utils/notification.service';

const store = {
  smartSkin: localStorage.getItem('sm-skin') || config.smartSkin,
  skin: config.skins.find((_skin) => {
    return _skin.name === (localStorage.getItem('sm-skin') || config.smartSkin);
  }),
  skins: config.skins,
  fixedHeader: localStorage.getItem('sm-fixed-header') === 'true',
  fixedNavigation: localStorage.getItem('sm-fixed-navigation') === 'true',
  fixedRibbon: localStorage.getItem('sm-fixed-ribbon') === 'true',
  fixedPageFooter: localStorage.getItem('sm-fixed-page-footer') === 'true',
  insideContainer: localStorage.getItem('sm-inside-container') === 'true',
  rtl: localStorage.getItem('sm-rtl') === 'true',
  menuOnTop: localStorage.getItem('sm-menu-on-top') === 'true',
  colorblindFriendly: localStorage.getItem('sm-colorblind-friendly') === 'true',

  shortcutOpen: false,
  isMobile: (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i
      .test(navigator.userAgent.toLowerCase())),
  device: '',

  mobileViewActivated: false,
  menuCollapsed: false,
  menuMinified: false,
};

@Injectable()
export class LayoutService {
  public store: any;

  private smartSkin: string;
  private subject: Subject<any>;

  constructor(private notificationService: NotificationService) {
    this.subject = new Subject();
    this.store = store;
    this.trigger();

    Observable.fromEvent(window, 'resize').debounceTime(100).map(() => {
      this.trigger();
    }).subscribe();
  }

  public trigger() {
    this.processBody(this.store);
    this.subject.next(this.store);
  }

  public subscribe(next, err?, complete?) {
    return this.subject.subscribe(next, err, complete);
  }

  public onSmartSkin(skin) {
    this.store.skin = skin;
    this.store.smartSkin = skin.name;
    this.dumpStorage();
    this.trigger();
  }

  public onFixedHeader() {
    this.store.fixedHeader = !this.store.fixedHeader;
    if (this.store.fixedHeader === false) {
      this.store.fixedRibbon = false;
      this.store.fixedNavigation = false;
    }
    this.dumpStorage();
    this.trigger();
  }

  public onFixedNavigation() {
    this.store.fixedNavigation = !this.store.fixedNavigation;

    if (this.store.fixedNavigation) {
      this.store.insideContainer = false;
      this.store.fixedHeader = true;
    } else {
      this.store.fixedRibbon = false;
    }
    this.dumpStorage();
    this.trigger();
  }

  public onFixedRibbon() {
    this.store.fixedRibbon = !this.store.fixedRibbon;
    if (this.store.fixedRibbon) {
      this.store.fixedHeader = true;
      this.store.fixedNavigation = true;
      this.store.insideContainer = false;
    }
    this.dumpStorage();
    this.trigger();
  }

  public onFixedPageFooter() {
    this.store.fixedPageFooter = !this.store.fixedPageFooter;
    this.dumpStorage();
    this.trigger();
  }

  public onInsideContainer() {
    this.store.insideContainer = !this.store.insideContainer;
    if (this.store.insideContainer) {
      this.store.fixedRibbon = false;
      this.store.fixedNavigation = false;
    }
    this.dumpStorage();
    this.trigger();
  }

  public onRtl() {
    this.store.rtl = !this.store.rtl;
    this.dumpStorage();
    this.trigger();
  }

  public onMenuOnTop() {
    this.store.menuOnTop = !this.store.menuOnTop;
    this.dumpStorage();
    this.trigger();
  }

  public onColorblindFriendly() {
    this.store.colorblindFriendly = !this.store.colorblindFriendly;
    this.dumpStorage();
    this.trigger();
  }

  public onCollapseMenu(value?) {
    if (typeof value !== 'undefined') {
      this.store.menuCollapsed = value;
    } else {
      this.store.menuCollapsed = !this.store.menuCollapsed;
    }

    this.trigger();
  }

  public onMinifyMenu() {
    this.store.menuMinified = !this.store.menuMinified;
    this.trigger();
  }

  public onShortcutToggle(condition?: any) {
    if (condition == null) {
      this.store.shortcutOpen = !this.store.shortcutOpen;
    } else {
      this.store.shortcutOpen = !!condition;
    }

    this.trigger();
  }

  public dumpStorage() {
    localStorage.setItem('sm-skin', this.store.smartSkin);
    localStorage.setItem('sm-fixed-header', this.store.fixedHeader);
    localStorage.setItem('sm-fixed-navigation', this.store.fixedNavigation);
    localStorage.setItem('sm-fixed-ribbon', this.store.fixedRibbon);
    localStorage.setItem('sm-fixed-page-footer', this.store.fixedPageFooter);
    localStorage.setItem('sm-inside-container', this.store.insideContainer);
    localStorage.setItem('sm-rtl', this.store.rtl);
    localStorage.setItem('sm-menu-on-top', this.store.menuOnTop);
    localStorage.setItem('sm-colorblind-friendly', this.store.colorblindFriendly);
  }

  public factoryReset() {
    this.notificationService.smartMessageBox({
      title: "<i class='fa fa-refresh' style='color:green'></i> Clear Local Storage",
      content: 'Would you like to RESET all your saved widgets and clear LocalStorage?',
      buttons: '[No][Yes]'
    }, (ButtonPressed) => {
      if (ButtonPressed === 'Yes' && localStorage) {
        localStorage.clear();
        location.reload();
      }
    });
  }

  public processBody(state) {
    const body = document.body;
    while (body.classList.length > 0) {
      body.classList.remove(body.classList[0]);
    }

    body.classList.add(state.skin.name);

    body.classList.toggle('fixed-header', state.fixedHeader);
    body.classList.toggle('fixed-header', state.fixedHeader);
    body.classList.toggle('fixed-navigation', state.fixedNavigation);
    body.classList.toggle('fixed-ribbon', state.fixedRibbon);
    body.classList.toggle('fixed-page-footer', state.fixedPageFooter);
    body.classList.toggle('container', state.insideContainer);
    body.classList.toggle('smart-rtl', state.rtl);
    body.classList.toggle('menu-on-top', state.menuOnTop);
    body.classList.toggle('colorblind-friendly', state.colorblindFriendly);
    body.classList.toggle('shortcut-on', state.shortcutOpen);

    const windowWidth =
      window.innerWidth || document.documentElement.clientWidth || body.clientWidth;

    state.mobileViewActivated = windowWidth < 979;
    body.classList.toggle('mobile-view-activated', state.mobileViewActivated);
    if (state.mobileViewActivated) {
      body.classList.remove('minified');
    }

    if (state.isMobile) {
      body.classList.add('mobile-detected');
    } else {
      body.classList.add('desktop-detected');
    }

    if (state.menuOnTop) {
      body.classList.remove('minified');
    }

    if (!state.menuOnTop) {
      body.classList.toggle('hidden-menu-mobile-lock', state.menuCollapsed);
      body.classList.toggle('hidden-menu', state.menuCollapsed);
      body.classList.remove('minified');
    } else if (state.menuOnTop && state.mobileViewActivated) {
      body.classList.toggle('hidden-menu-mobile-lock', state.menuCollapsed);
      body.classList.toggle('hidden-menu', state.menuCollapsed);
      body.classList.remove('minified');
    }

    if (state.menuMinified && !state.menuOnTop && !state.mobileViewActivated) {
      body.classList.add('minified');
      body.classList.remove('hidden-menu');
      body.classList.remove('hidden-menu-mobile-lock');
    }
  }
}
