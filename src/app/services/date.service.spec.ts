import { TestBed, inject } from '@angular/core/testing';

import { DateService } from './date.service';

const date = '12-10-2020',
  anotherDate = '14-10-2020',
  timestamp = 1602460800,
  range = {
    from: '5-10-2020',
    to: '13-10-2020',
  };

describe('DateService', () => {
  let dateServ: DateService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateService]
    });
    dateServ = TestBed.get(DateService);
  });

  it('should be created', inject([DateService], (service: DateService) => {
    expect(service).toBeTruthy();
  }));

  it('should convert date to timestamp', () => {
    expect(dateServ.toTimestamp(date)).toBe(timestamp);
  });

  it('should convert timestamp back to date', () => {
    expect(dateServ.toString(timestamp)).toBe(date);
  });

  it('should get Days betweend two dates', () => {
    expect(dateServ.getDaysBetween(range.from, range.to)).toBe(8);
  });

  it('should return false if date is not between range', () => {
    expect(dateServ.isBetween(anotherDate, range)).toBeFalsy();
  });

  it('should return true if date is between range', () => {
    expect(dateServ.isBetween(date, range)).toBeTruthy();
  });

});
