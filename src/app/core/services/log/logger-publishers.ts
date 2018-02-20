import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { LogEntry } from './logger.service';
import { DataService } from '../data.service';

export abstract class LoggerPublisher {
  public location: string;

  public abstract log(record: LogEntry): Observable<boolean>;
  public abstract clear(): Observable<boolean>;
}

// tslint:disable-next-line:max-classes-per-file
export class LoggerConsole extends LoggerPublisher {
  public log(record: LogEntry): Observable<boolean> {
    // Log to the console
    console.log(record.buildLogString());

    return Observable.of(true);
  }

  public clear(): Observable<boolean> {
    console.clear();

    return Observable.of(true);
  }
}

// tslint:disable-next-line:max-classes-per-file
export class LoggerLocalStorage extends LoggerPublisher {
  constructor() {
    super();

    this.location = 'logging';
  }

  public getAll(): Observable<LogEntry[]> {
    let values: LogEntry[];

    // Retrieve all values from local storage
    const location = localStorage.getItem(this.location);
    values = location ? JSON.parse(location) : [];

    return Observable.of(values);
  }

  public log(record: LogEntry): Observable<boolean> {
    const ret = false;
    let values: LogEntry[];

    try {
      const sessionValues = localStorage.getItem(this.location);
      values = sessionValues ? JSON.parse(sessionValues) : [];
      // Add new log entry to the array
      values.push(record);
      // Store the complete array into local storage
      localStorage.setItem(this.location, JSON.stringify(values));
    } catch (ex) {
      console.log(ex);
    }

    return Observable.of(ret);
  }

  public clear(): Observable<boolean> {
    localStorage.removeItem(this.location);
    return Observable.of(true);
  }
}

// tslint:disable-next-line:max-classes-per-file
export class LoggerPublisherConfig {
  public loggerName: string;
  public loggerLocation: string;
  public isActive: boolean;
}
