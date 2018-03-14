import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpResponseBase, HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class UtilityService {

  public readonly captionAndMessageSeparator = ':';
  public readonly noNetworkMessageCaption = 'No Network';
  public readonly noNetworkMessageDetail = 'The server cannot be reached';
  public readonly accessDeniedMessageCaption = 'Access Denied!';
  public readonly accessDeniedMessageDetail = '';

  public cookies = {
    getItem: (sKey) => {
      return decodeURIComponent(
        document.cookie.replace(
          new RegExp('(?:(?:^|.*;)\\s*'
            + encodeURIComponent(sKey)
              .replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
    },
    setItem: (sKey, sValue, vEnd, sPath, sDomain, bSecure) => {
      if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
        return false;
      }

      let sExpires = '';

      if (vEnd) {
        switch (vEnd.constructor) {
          case Number:
            sExpires = vEnd === Infinity
              ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT'
              : '; max-age=' + vEnd;
            break;
          case String:
            sExpires = '; expires=' + vEnd;
            break;
          case Date:
            sExpires = '; expires=' + vEnd.toUTCString();
            break;
        }
      }

      document.cookie =
        encodeURIComponent(sKey) +
        '=' + encodeURIComponent(sValue) +
        sExpires +
        (sDomain ? '; domain=' + sDomain : '') +
        (sPath ? '; path=' + sPath : '') +
        (bSecure ? '; secure' : '');
      return true;
    },
    removeItem: (sKey, sPath, sDomain) => {
      if (!sKey) {
        return false;
      }
      document.cookie =
        encodeURIComponent(sKey) +
        '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' +
        (sDomain ? '; domain=' + sDomain : '') +
        (sPath ? '; path=' + sPath : '');
      return true;
    },
    hasItem: (sKey) => {
      return (
        new RegExp('(?:^|;\\s*)' +
          encodeURIComponent(sKey)
            .replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie);
    },
    keys: () => {
      const aKeys = document.cookie
        .replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '')
        .split(/\s*(?:\=[^;]*)?;\s*/);
      for (let nIdx = 0; nIdx < aKeys.length; nIdx++) {
        aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
      }
      return aKeys;
    }
  };

  public _router: Router;
  constructor(router: Router, private route: ActivatedRoute) {
    this._router = router;
  }

  public convertDateTime(date: Date) {
    const _formattedDate = new Date(date.toString());
    return _formattedDate.toDateString();
  }

  public navigate(path: string) {
    this._router.navigate([path]);
  }

  public navigateToReturnUrl() {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this._router.navigate([returnUrl]);
  }

  public navigateToSignIn() {
    this.navigate('/auth/login');
  }

  public getParams() {
    const searchParams = window.location.search.split('?')[1];
    if (searchParams) {
      const paramsObj: any = {};

      searchParams.split('&').forEach((i) => {
        paramsObj[i.split('=')[0]] = i.split('=')[1];
      });
      return paramsObj;
    }
    return undefined;
  }
  public readableColumnName(columnName: string): string {
    // Convert underscores to spaces
    if (typeof (columnName) === 'undefined' || columnName === undefined || columnName === null) {
      return columnName;
    }

    if (typeof (columnName) !== 'string') {
      columnName = String(columnName);
    }

    return columnName.replace(/_+/g, ' ')
      // Replace a completely all-capsed word with a first-letter-capitalized version
      .replace(/^[A-Z]+$/, (match) => {
        return ((match.charAt(0)).toUpperCase() + match.slice(1)).toLowerCase();
      })
      // Capitalize the first letter of words
      .replace(/([\w\u00C0-\u017F]+)/g, (match) => {
        return (match.charAt(0)).toUpperCase() + match.slice(1);
      })
      // Put a space in between words that have partial capilizations
      // (i.e. 'firstName' becomes 'First Name')
      // .replace(/([A-Z]|[A-Z]\w+)([A-Z])/g, "$1 $2");
      // .replace(/(\w+?|\w)([A-Z])/g, "$1 $2");
      .replace(/(\w+?(?=[A-Z]))/g, '$1 ');
  }

  public loadStyle(link: string): Observable<any> {
    if (this.isLoadedStyle(link)) {
      return Observable.of('');
    } else {
      const head = document.getElementsByTagName('head')[0];
      // Load jquery Ui
      const styleNode = document.createElement('link');
      styleNode.rel = 'stylesheet';
      styleNode.type = 'text/css';
      styleNode.href = link;
      styleNode.media = 'all';
      head.appendChild(styleNode);
      return Observable.fromEvent(styleNode, 'load');
    }
  }
  public loadScript(script: string): Observable<any> {
    if (this.isLoadedScript(script)) {
      return Observable.of('');
    } else {
      const head = document.getElementsByTagName('head')[0];
      // Load jquery Ui
      const scriptNode = document.createElement('script');
      scriptNode.src = script;
      scriptNode.async = false;
      // scriptNode.type = 'text/javascript';
      // scriptNode.charset = 'utf-8';
      head.insertBefore(scriptNode, head.firstChild);
      return Observable.fromEvent(scriptNode, 'load');
    }
  }
  public toQueryParams(obj: any): string {
    return Object.keys(obj)
      .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
      .join('&');
  }

  public fromQueryParams(queryString: string): object {
    const query: any = {};
    const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i].split('=');
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
  }

  public formatErrors(errors: any) {
    return errors ? errors.map((err: any) => err.message).join('/n') : '';
  }

  public getHttpResponseMessage(data: HttpResponseBase | any): string[] {
    const responses: string[] = [];

    if (data instanceof HttpResponseBase) {

      if (this.checkNoNetwork(data)) {
        responses.push(`
          ${this.noNetworkMessageCaption}
          ${this.captionAndMessageSeparator}
          ${this.noNetworkMessageDetail}
        `);
      } else {
        const responseObject = this.getResponseBody(data);

        if (responseObject &&
          (typeof responseObject === 'object' || responseObject instanceof Object)) {

          for (const key in responseObject) {
            if (key) {
              responses.push(`${key}${this.captionAndMessageSeparator} ${responseObject[key]}`);
            } else if (responseObject[key]) {
              responses.push(responseObject[key].toString());
            }
          }
        }
      }

      if (!responses.length && this.getResponseBody(data)) {
        responses.push(`${data.statusText}: ${this.getResponseBody(data).toString()}`);
      }
    }

    if (!responses.length) {
      responses.push(data.toString());
    }

    if (this.checkAccessDenied(data)) {
      responses.splice(0, 0, `
        ${this.accessDeniedMessageCaption}
        ${this.captionAndMessageSeparator} ${this.accessDeniedMessageDetail}`);
    }

    return responses;
  }

  public findHttpResponseMessage(
    messageToFind: string,
    data: HttpResponse<any> | any, seachInCaptionOnly = true,
    includeCaptionInResult = false): string {

    const searchString = messageToFind.toLowerCase();
    const httpMessages = this.getHttpResponseMessage(data);

    for (const message of httpMessages) {
      const fullMessage = this.splitInTwo(message, this.captionAndMessageSeparator);

      if (
        fullMessage.firstPart &&
        fullMessage.firstPart.toLowerCase().indexOf(searchString) !== -1) {
        return includeCaptionInResult ? message : fullMessage.secondPart || fullMessage.firstPart;
      }
    }

    if (!seachInCaptionOnly) {
      for (const message of httpMessages) {

        if (message.toLowerCase().indexOf(searchString) !== -1) {
          if (includeCaptionInResult) {
            return message;
          } else {
            const fullMessage = this.splitInTwo(message, this.captionAndMessageSeparator);
            return fullMessage.secondPart || fullMessage.firstPart;
          }
        }
      }
    }

    return null;
  }

  public getResponseBody(response: HttpResponseBase) {
    if (response instanceof HttpResponse) {
      return response.body;
    }

    if (response instanceof HttpErrorResponse) {
      return response.error || response.message || response.statusText;
    }
  }

  public checkNoNetwork(response: HttpResponseBase) {
    if (response instanceof HttpResponseBase) {
      return response.status === 0;
    }

    return false;
  }

  public checkAccessDenied(response: HttpResponseBase) {
    if (response instanceof HttpResponseBase) {
      return response.status === 403;
    }

    return false;
  }

  public checkNotFound(response: HttpResponseBase) {
    if (response instanceof HttpResponseBase) {
      return response.status === 404;
    }

    return false;
  }

  public checkIsLocalHost(url: string, base?: string) {
    if (url) {
      const location = new URL(url, base);
      return location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    }

    return false;
  }

  public getQueryParamsFromString(paramString: string) {

    if (!paramString) {
      return null;
    }

    const params: { [key: string]: string } = {};

    for (const param of paramString.split('&')) {
      const keyValue = this.splitInTwo(param, '=');
      params[keyValue.firstPart] = keyValue.secondPart;
    }

    return params;
  }

  public splitInTwo(text: string, separator: string): { firstPart: string, secondPart: string } {
    const separatorIndex = text.indexOf(separator);

    if (separatorIndex === -1) {
      return { firstPart: text, secondPart: null };
    }

    const part1 = text.substr(0, separatorIndex).trim();
    const part2 = text.substr(separatorIndex + 1).trim();

    return { firstPart: part1, secondPart: part2 };
  }

  public safeStringify(object) {

    let result: string;

    try {
      result = JSON.stringify(object);
      return result;
      // tslint:disable-next-line:no-empty
    } catch (error) { }

    const simpleObject = {};

    for (const prop in object) {
      if (!object.hasOwnProperty(prop)) {
        continue;
      }
      if (typeof (object[prop]) === 'object') {
        continue;
      }
      if (typeof (object[prop]) === 'function') {
        continue;
      }
      simpleObject[prop] = object[prop];
    }

    result = '[***Sanitized Object***]: ' + JSON.stringify(simpleObject);

    return result;
  }

  public JSonTryParse(value: string) {
    try {
      return JSON.parse(value);
    } catch (e) {
      if (value === 'undefined') {
        return void 0;
      }

      return value;
    }
  }

  public TestIsObjectEmpty(obj: any) {
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return true;
  }

  public TestIsUndefined(value: any) {
    return typeof value === 'undefined';
    // return value === undefined;
  }

  public TestIsString(value: any) {
    return typeof value === 'string' || value instanceof String;
  }

  public capitalizeFirstLetter(text: string) {
    if (text) {
      return text.charAt(0).toUpperCase() + text.slice(1);
    } else {
      return text;
    }
  }

  public toTitleCase(text: string) {
    return text.replace(/\w\S*/g, (subString) => {
      return subString.charAt(0).toUpperCase() + subString.substr(1).toLowerCase();
    });
  }

  public toLowerCase(items: string | string[]);
  public toLowerCase(items: any): string | string[] {

    if (items instanceof Array) {
      const loweredRoles: string[] = [];

      for (let i = 0; i < items.length; i++) {
        loweredRoles[i] = items[i].toLowerCase();
      }

      return loweredRoles;
    } else if (typeof items === 'string' || items instanceof String) {
      return items.toLowerCase();
    }
  }

  public uniqueId() {
    return this.randomNumber(1000000, 9000000).toString();
  }

  public randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  public baseUrl() {
    let base = '';

    if (window.location.origin) {
      base = window.location.origin;
    } else {
      base = window.location.protocol +
        '//' + window.location.hostname +
        (window.location.port ? ':' + window.location.port : '');
    }

    return base.replace(/\/$/, '');
  }

  public printDateOnly(date: Date) {

    date = new Date(date);

    const dayNames = new Array(
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
    const monthNames = new Array(
      'January',
      'February',
      'March',
      'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

    const dayOfWeek = date.getDay();
    const dayOfMonth = date.getDate();
    let sup = '';
    const month = date.getMonth();
    const year = date.getFullYear();

    if (dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31) {
      sup = 'st';
    } else if (dayOfMonth === 2 || dayOfMonth === 22) {
      sup = 'nd';
    } else if (dayOfMonth === 3 || dayOfMonth === 23) {
      sup = 'rd';
    } else {
      sup = 'th';
    }

    const dateString =
      dayNames[dayOfWeek] + ', ' + dayOfMonth + sup + ' ' + monthNames[month] + ' ' + year;

    return dateString;
  }

  public printTimeOnly(date: Date) {

    date = new Date(date);

    let period = '';
    let minute = date.getMinutes().toString();
    let hour = date.getHours();

    period = hour < 12 ? 'AM' : 'PM';

    if (hour === 0) {
      hour = 12;
    }
    if (hour > 12) {
      hour = hour - 12;
    }

    if (minute.length === 1) {
      minute = '0' + minute;
    }

    const timeString = hour + ':' + minute + ' ' + period;

    return timeString;
  }

  public printDate(date: Date, separator = 'at') {
    return `${this.printDateOnly(date)} ${separator} ${this.printTimeOnly(date)}`;
  }

  public printFriendlyDate(date: Date, separator = '-') {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    const test = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (test.toDateString() === today.toDateString()) {
      return `Today ${separator} ${this.printTimeOnly(date)}`;
    }
    if (test.toDateString() === yesterday.toDateString()) {
      return `Yesterday ${separator} ${this.printTimeOnly(date)}`;
    } else {
      return this.printDate(date, separator);
    }
  }

  public printShortDate(date: Date, separator = '/', dateTimeSeparator = '-') {

    let day = date.getDate().toString();
    let month = (date.getMonth() + 1).toString();
    const year = date.getFullYear();

    if (day.length === 1) {
      day = '0' + day;
    }

    if (month.length === 1) {
      month = '0' + month;
    }

    return `
      ${month}
      ${separator}
      ${day}${separator}${year} ${dateTimeSeparator} ${this.printTimeOnly(date)}`;
  }

  public parseDate(date) {

    if (date) {

      if (date instanceof Date) {
        return date;
      }

      if (typeof date === 'string' || date instanceof String) {
        if (date.search(/[a-su-z+]/i) === -1) {
          date = date + 'Z';
        }

        return new Date(date);
      }

      if (typeof date === 'number' || date instanceof Number) {
        return new Date(date as any);
      }
    }
  }

  public printDuration(start: Date, end: Date) {

    start = new Date(start);
    end = new Date(end);

    // get total seconds between the times
    let delta = Math.abs(start.valueOf() - end.valueOf()) / 1000;

    // calculate (and subtract) whole days
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    const seconds = delta % 60;  // in theory the modulus is not required

    let printedDays = '';

    if (days) {
      printedDays = `${days} days`;
    }

    if (hours) {
      printedDays += printedDays ? `, ${hours} hours` : `${hours} hours`;
    }

    if (minutes) {
      printedDays += printedDays ? `, ${minutes} minutes` : `${minutes} minutes`;
    }

    if (seconds) {
      printedDays += printedDays ? ` and ${seconds} seconds` : `${seconds} seconds`;
    }

    if (!printedDays) {
      printedDays = '0';
    }

    return printedDays;
  }

  public getAge(birthDate, otherDate) {
    birthDate = new Date(birthDate);
    otherDate = new Date(otherDate);

    let years = (otherDate.getFullYear() - birthDate.getFullYear());

    if (otherDate.getMonth() < birthDate.getMonth() ||
      otherDate.getMonth() === birthDate.getMonth() && otherDate.getDate() < birthDate.getDate()) {
      years--;
    }

    return years;
  }

  public searchArray(searchTerm: string, caseSensitive: boolean, ...values: any[]) {

    if (!searchTerm) {
      return true;
    }

    if (!caseSensitive) {
      searchTerm = searchTerm.toLowerCase();
    }

    for (const value of values) {

      if (value != null) {
        let strValue = value.toString();

        if (!caseSensitive) {
          strValue = strValue.toLowerCase();
        }

        if (strValue.indexOf(searchTerm) !== -1) {
          return true;
        }
      }
    }

    return false;
  }

  public expandCamelCase(text: string) {

    if (!text) {
      return text;
    }

    return text.replace(/([A-Z][a-z]+)/g, ' $1')
      .replace(/([A-Z][A-Z]+)/g, ' $1')
      .replace(/([^A-Za-z ]+)/g, ' $1');
  }

  public testIsAbsoluteUrl(url: string) {

    const r = new RegExp('^(?:[a-z]+:)?//', 'i');
    return r.test(url);
  }

  public convertToAbsoluteUrl(url: string) {

    return this.testIsAbsoluteUrl(url) ? url : '//' + url;
  }

  public removeNulls(obj) {
    const isArray = obj instanceof Array;

    for (const k in obj) {
      if (obj.hasOwnProperty(k)) {
        if (obj[k] === null) {
          isArray ? obj.splice(k, 1) : delete obj[k];
        } else if (typeof obj[k] === 'object') {
          this.removeNulls(obj[k]);
        }

        if (isArray && obj.length === k) {
          this.removeNulls(obj);
        }
      }
    }

    return obj;
  }

  public debounce(func: (...args) => any, wait: number, immediate?: boolean) {
    let timeout;

    return function () {
      const context = this;
      // tslint:disable-next-line:variable-name
      const args_ = arguments;

      const later = function () {
        timeout = null;
        if (!immediate) {
          func.apply(context, args_);
        }
      };

      const callNow = immediate && !timeout;

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);

      if (callNow) {
        func.apply(context, args_);
      }
    };
  }

  // Detect if library loaded
  private isLoadedScript(lib: string) {
    return document.querySelectorAll('[src="' + lib + '"]').length > 0;
  }

  private isLoadedStyle(lib: string) {
    return document.querySelectorAll('[href="' + lib + '"]').length > 0;
  }

  public getRandomInt(start, end) {
    return Math.floor(Math.random() * end) + start;
  }
  public getRandomColor() {
    return '#' + (this.pad(this.getRandomInt(0, 255).toString(16), 2) + this.pad(this.getRandomInt(0, 255).toString(16), 2) + this.pad(this.getRandomInt(0, 255).toString(16), 2));
  }
  public pad(str, length) {
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
  }
  public getRandomNum(min, max) {
    return Math.random() * (max - min) + min;
  }

  public clearVietNamChar(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
}
}
