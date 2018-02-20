/**
 * Simple logger system with the possibility of registering custom outputs.
 *
 * 4 different log levels are provided, with corresponding methods:
 * - debug   : for debug information
 * - info    : for informative status of the application (success, ...)
 * - warning : for non-critical errors that do not prevent normal application behavior
 * - error   : for critical errors that prevent normal application behavior
 *
 * Example usage:
 * ```
 * import { Logger } from 'app/core/logger.service';
 *
 * const log = new Logger('myFile');
 * ...
 * log.debug('something happened');
 * ```
 *
 * To disable debug and info logs in production, add this snippet to your root component:
 * ```
 * export class AppComponent implements OnInit {
 *   ngOnInit() {
 *     if (environment.production) {
 *       Logger.enableProductionMode();
 *     }
 *     ...
 *   }
 * }
 *
 * If you want to process logs through other outputs than console,
 * you can add LogOutput functions to Logger.outputs.
 */

/**
 * The possible log levels.
 * LogLevel.Off is never emitted and only used with LoggerService.level property to disable logs.
 */
import { LoggerPublisher } from './logger-publishers';
import { LoggerPublishersService } from './logger-publishers.service';
import { Injectable } from '@angular/core';

export enum LogLevel {
  All = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Fatal = 5,
  Off = 6
}

export class LogEntry {
  // Public properties
  public entryDate: Date = new Date();
  public message = '';
  public level: LogLevel = LogLevel.Debug;
  public extraInfo: any[] = [];
  public logWithDate = true;

  public buildLogString(): string {
    let ret = '';

    if (this.logWithDate) {
      ret = new Date() + ' - ';
    }

    ret += ' Type: ' + LogLevel[this.level];
    ret += ' - Message: ' + this.message;
    if (this.extraInfo.length) {
      ret += ' - Extra Info: ' + this.formatParams(this.extraInfo);
    }

    return ret;
  }

  private formatParams(params: any[]): string {
    let ret: string = params.join(',');

    if (params.some((p) => typeof p === 'object')) {
      ret = '';
      for (const item of params) {
        ret += JSON.stringify(item) + ',';
      }
    }

    return ret;
  }
}

// tslint:disable-next-line:max-classes-per-file
@Injectable()
export class LoggerService {

  /**
   * Current logging level.
   * Set it to LogLevel.Off to disable logs completely.
   */
  public static level: LogLevel = LogLevel.All;

  public logWithDate = true;
  public publishers: LoggerPublisher[];

  constructor(private publishersService: LoggerPublishersService) {
    this.publishers = publishersService.publishers;
  }

  /**
   * Enables production mode.
   * Sets logging level to LogLevel.Warning.
   */
  public enableProductionMode() {
    LoggerService.level = LogLevel.Warn;
  }

  /**
   * Logs messages or objects  with the debug level.
   * Works the same as console.log().
   */
  public debug(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Debug, optionalParams);
  }

  /**
   * Logs messages or objects  with the info level.
   * Works the same as console.log().
   */
  public info(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Info, optionalParams);
  }

  /**
   * Logs messages or objects  with the warning level.
   * Works the same as console.log().
   */
  public warn(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Warn, optionalParams);
  }

  /**
   * Logs messages or objects  with the error level.
   * Works the same as console.log().
   */
  public error(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Error, optionalParams);
  }

  public fatal(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Fatal, optionalParams);
  }

  public log(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.All, optionalParams);
  }

  public clear(): void {
    for (const logger of this.publishers) {
      logger.clear();
    }
  }

  private shouldLog(level: LogLevel): boolean {
    let ret = false;

    if (LoggerService.level !== LogLevel.Off && level >= LoggerService.level) {
      ret = true;
    }

    return ret;
  }

  private writeToLog(msg: string, level: LogLevel, params: any[]) {
    if (this.shouldLog(level)) {
      const entry: LogEntry = new LogEntry();

      entry.message = msg;
      entry.level = level;
      entry.extraInfo = params;
      entry.logWithDate = this.logWithDate;

      // Log the value to all publishers
      for (const logger of this.publishers) {
        logger.log(entry);
      }
    }
  }

}
