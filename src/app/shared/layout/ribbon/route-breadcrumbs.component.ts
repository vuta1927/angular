import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-route-breadcrumbs',
  template: `
        <ol class="breadcrumb">
           <li *ngFor="let item of items">{{ item | translate }}</li>
        </ol>
  `,
  styles: []
})
export class RouteBreadcrumbsComponent implements OnInit, OnDestroy {

  public items: string[] = [];
  private sub;

  constructor(
    private router: Router
  ) { }

  public ngOnInit() {
    this.extract(this.router.routerState.root);
    this.sub = this.router.events
      .filter((e) => e instanceof NavigationEnd)
      .subscribe((v) => {
        this.items = [];
        this.extract(this.router.routerState.root);
      });

  }

  public ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public extract(route) {
    const pageTitle = route.data.value['pageTitle'];
    if (pageTitle && this.items.indexOf(pageTitle) === -1) {
      this.items.push(route.data.value['pageTitle']);
    }
    if (route.children) {
      route.children.forEach((it) => {
        this.extract(it);
      });
    }
  }
}
