import { Component } from '@angular/core';

@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html'
})
export class FullScreenComponent {
  public onToggle() {
    const body = document.body;
    const documentMethods = {
      enter: [
        'requestFullscreen',
        'mozRequestFullScreen',
        'webkitRequestFullscreen',
        'msRequestFullscreen'
      ],
      exit: [
        'cancelFullScreen',
        'mozCancelFullScreen',
        'webkitCancelFullScreen',
        'msCancelFullScreen'
      ]
    };

    if (!body.classList.contains('full-screen')) {
      body.classList.add('full-screen');
      document.documentElement[documentMethods.enter.filter((method) => {
        return document.documentElement[method];
      })[0]]();
    } else {
      body.classList.remove('full-screen');
      document[documentMethods.exit.filter((method) => {
        return document[method];
      })[0]]();
    }
  }
}
