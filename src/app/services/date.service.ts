import { Injectable } from '@angular/core';

/**
 * A service to handle date calculations
 *
 * @constructor fetchs hotels from the api
*/
@Injectable()
export class DateService {

  constructor() { }

  /**
   * converts a date string into a timestamp
   *
   * @param str date string in the format of 'dd-mm-yyyy'
   */
  toTimestamp(str) {
    const arrDate = str.split('-'),
      strDate = arrDate[1] + '-' + arrDate[0] + '-' + arrDate[2],
      timeStamp = Date.parse(strDate);
    return timeStamp / 1000;
  }

  /**
   * converts timestamp to a date string in the format of 'dd-mm-yyyy'
   *
   * @param timeStamp time stamp to be converted
   */
  toString(timeStamp) {
    const date = new Date(timeStamp * 1000);
    const year = date.getUTCFullYear();
    const month = 1 + date.getUTCMonth();
    const day = 1 + date.getUTCDate();
    return day + '-' + month + '-' + year;
  }

  /**
   * gets number of days between to dates
   *
   * @param fromStr start date string  in the format of 'dd-mm-yyyy'
   * @param toStr end date string  in the format of 'dd-mm-yyyy'
   */
  getDaysBetween(fromStr, toStr) {
    const from = this.toTimestamp(fromStr),
      to = this.toTimestamp(toStr);
    const diff = to - from;
    return diff / (60 * 60 * 24);
  }

  /**
   * checks if a date is between a date range
   *
   * @param dateStr date string  in the format of 'dd-mm-yyyy' to be checked
   * @param rangeStr object contains the date range to check in
   */
  isBetween(dateStr, rangeStr: { from: string, to: string }) {
    const date = this.toTimestamp(dateStr),
      from = this.toTimestamp(rangeStr.from),
      to = this.toTimestamp(rangeStr.to);
    return date >= from && date <= to;
  }
}
