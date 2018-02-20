import {
  Directive,
  ElementRef,
  OnInit,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { setTimeout } from 'timers';
import { LayoutService } from 'app/shared/layout';

declare let $: any;

@Directive({
  selector: '[saSmartMenu]'
})
export class SmartMenuDirective implements OnInit, AfterViewInit, OnDestroy {

  private $menu: any;
  private layoutSub: Subscription;

  constructor(
    private menu: ElementRef,
    public layoutService: LayoutService
  ) {
    this.$menu = $(this.menu.nativeElement);
  }

  public ngOnInit() {
    this.layoutSub = this.layoutService.subscribe((store) => {
      this.processLayout(store);
    });

    // collapse menu on mobiles
    $('[routerLink]', this.$menu).on('click', () => {
      if (this.layoutService.store.mobileViewActivated) {
        this.layoutService.onCollapseMenu();
      }
    });
  }

  public ngAfterViewInit() {
    this.$menu.find('li:has(> ul)').each((i, li) => {
      const $menuItem = $(li);
      const $a = $menuItem.find('>a');
      const sign = $('<b class="collapse-sign"><em class="fa fa-plus-square-o"/></b>');

      $a.on('click', (e) => {
        this.toggle($menuItem);
        e.stopPropagation();
        return false;
      }).append(sign);
    });

    setTimeout(() => {
      this.processLayout(this.layoutService.store);
    }, 200);
  }

  public ngOnDestroy() {
    this.layoutSub.unsubscribe();
  }

  private processLayout = (layoutStore) => {
    if (layoutStore.menuOnTop) {
      this.$menu.find('li.open').each((i, li) => {
        this.toggle($(li), false);
      });
    } else {
      this.$menu.find('li.active').each((i, li) => {
        $(li).parents('li').each((j, parentLi) => {
          this.toggle($(parentLi), true);
        });
      });
    }

    if (layoutStore.mobileViewActivated) {
      document.body.classList.remove('minified');
    }
  }

  private toggle($el, condition = !$el.data('open')) {
    $el.toggleClass('open', condition);

    if (condition) {
      $el.find('>ul').slideDown();
    } else {
      $el.find('>ul').slideUp();
    }

    $el.find('>a>.collapse-sign>em')
      .toggleClass('fa-plus-square-o', !condition)
      .toggleClass('fa-minus-square-o', condition);

    $el.data('open', condition);

    if (condition) {
      $el.siblings('.open').each((i, it) => {
        const sib = $(it);
        this.toggle(sib, false);
      });
    }
  }
}
