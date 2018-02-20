import { Component, OnInit, OnDestroy, ElementRef, Renderer2, Renderer } from '@angular/core';
import { ActivitiesService } from './activities.service';

declare let $: any;

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  providers: [
    ActivitiesService
  ]
})
export class ActivitiesComponent implements OnInit, OnDestroy {

  public count: number;
  public lastUpdate: any;
  public active: boolean;
  public activities: any;
  public currentActivity: any;
  public loading: boolean;

  private documentSub: any;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private activitiesService: ActivitiesService) {
    this.active = false;
    this.loading = false;
    this.activities = [];
    this.count = 0;
    this.lastUpdate = new Date();
  }

  public ngOnInit() {
    this.getData();
  }

  public setActivity(activity) {
    this.currentActivity = activity;
  }

  public onToggle() {
    const dropdown = $('.ajax-dropdown', this.el.nativeElement);
    this.active = !this.active;
    if (this.active) {
      dropdown.fadeIn();

      this.documentSub = this.renderer.listen('document', 'mouseup', (event: Event) => {
        if (!this.el.nativeElement.contains(event.target)) {
          dropdown.fadeOut();
          this.active = false;
          this.documentUnsub();
        }
      });

    } else {
      dropdown.fadeOut();
      this.documentUnsub();
    }
  }

  public update() {
    this.loading = true;
    this.getData();
  }

  public documentUnsub() {
    this.documentSub = null;
  }

  public ngOnDestroy() {
    this.documentUnsub();
  }

  private getData(): void {
    this.activitiesService.getActivities().subscribe((data) => {
      this.activities = data;
      this.count = data.reduce((sum, it) => sum + it.data.length, 0);
      this.currentActivity = data[0];
      this.lastUpdate = new Date();
      this.loading = false;
    });
  }
}
