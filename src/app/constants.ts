import { environment } from '../environments/environment';

export class Constants {
  /** Date format */
  public static DATE_FMT = 'dd/MM/yyyy';
  public static DATE_FMT_JQUI = 'dd/mm/yy';
  public static DATE_TIME_FMT = `${Constants.DATE_FMT} hh:mm:ss`;

  /** API */
  public static REGISTER = '/register';
  public static LOGIN = '/login';

  public static GETMAP = 'maps';
  public static ADDROAD = 'roads';

  public static LOG_OUT = `${environment}/logout`;

  public static USER_INFO = 'assets/api/user/login-info.json';
  public static ACTIVITIES = 'assets/api/activities/activities.json';

  public static accDPs = 4;
  public static apiKey = 'AIzaSyCIdU-_NtOo4l9pcOEIDMGbgIPnRitcIx8';
  public static mapType = {
    Google: 100,
    Microsoft: 200,
    Fabric: 300,
  }
}
