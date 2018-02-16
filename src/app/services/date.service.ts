import { Injectable } from '@angular/core';

@Injectable()
export class DateService {

  constructor() { }

  toTimestamp(str) {
    const arrDate = str.split('-'),
      strDate = arrDate[1] + '-' + arrDate[0] + '-' + arrDate[2],
      timeStamp = Date.parse(strDate);
    return timeStamp / 1000;
  }

  toString(timeStamp) {
    const date = new Date(timeStamp * 1000);
    // Hours part from the timestamp
    const year = date.getFullYear();
    // Minutes part from the timestamp
    const month = 1 + date.getMonth();
    // Seconds part from the timestamp
    const day = 1 + date.getDate();
    return day + '-' + month + '-' + year;
  }

  getDaysBetween(fromStr, toStr) {
    const from = this.toTimestamp(fromStr),
      to = this.toTimestamp(toStr);
    const diff = to - from;
    return diff / (60 * 60 * 24);
  }

  isBetween(dateStr, rangeStr: { from: string, to: string }) {
    const date = this.toTimestamp(dateStr),
      from = this.toTimestamp(rangeStr.from),
      to = this.toTimestamp(rangeStr.to);
    if (date >= from && date <= to) {
      return true;
    } else {
      return false;
    }
  }
}
