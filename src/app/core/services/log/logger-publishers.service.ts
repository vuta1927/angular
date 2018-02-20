import { Injectable, Injector } from '@angular/core';
import { LoggerPublisher, LoggerConsole, LoggerLocalStorage } from './logger-publishers';

@Injectable()
export class LoggerPublishersService {
  public publishers: LoggerPublisher[] = [];

  constructor(private inj: Injector) {
    this.buildPublishers();
  }

  private buildPublishers(): void {
    this.publishers.push(new LoggerConsole());
    this.publishers.push(new LoggerLocalStorage());
  }
}
