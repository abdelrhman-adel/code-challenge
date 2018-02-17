import { TestBed, inject } from '@angular/core/testing';

import { HotelsService } from './hotels.service';
import { RequestsService } from './requests.service';
import { DateService } from './date.service';
import { Hotel } from '../models/hotel';

class RequestsServiceStub {
  get() { }
}
class DateServiceStub {
  isBetween() { }
  getDaysBetween() { }
}

const hotels = [
  {
    name: 'name1',
    price: 100,
    city: 'city1',
    availability: [],
  },
  {
    name: 'name2',
    price: 102,
    city: 'city2',
    availability: [],
  }
];


describe('HotelsService', () => {
  let hotelServ: HotelsService;
  let reqServ: RequestsService;
  let dateServ: DateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HotelsService,
        { provide: RequestsService, useClass: RequestsServiceStub },
        { provide: DateService, useClass: DateServiceStub }
      ]
    });
    hotelServ = TestBed.get(HotelsService);
    reqServ = TestBed.get(RequestsService);
    dateServ = TestBed.get(DateService);
  });

  it('should be created', inject([HotelsService], (service: HotelsService) => {
    expect(service).toBeTruthy();
  }));

  it('gets hotels', () => {
    spyOn(reqServ, 'get');
    hotelServ.getHotels();

    expect(reqServ.get).toHaveBeenCalled();
  });

  it('prepares hotels', () => {
    hotelServ.prepareHotels(hotels);

    expect(hotelServ.hotels).toContain(jasmine.any(Hotel));
  });

  it('calculates initial price', () => {
    hotelServ.prepareHotels(hotels);

    expect(hotelServ.searchData.price.min).toEqual(100);
    expect(hotelServ.searchData.price.max).toEqual(102);
  });

  it('sets date', () => {
    hotelServ.setDate('10-10-2020', '12-10-2020');

    expect(hotelServ.searchData.date.from).toEqual('10-10-2020');
    expect(hotelServ.searchData.date.to).toEqual('12-10-2020');
  });

  it('doesn\'t filters results when no nights are selected', () => {
    hotelServ.prepareHotels(hotels);
    hotelServ.filterResults();

    expect(hotelServ.filteredHotels).toEqual([]);
  });

  it('changes page', () => {
    hotelServ.changePage(3);

    expect(hotelServ.pagination.curPage).toEqual(3);
  });

  it('performs search', () => {
    hotelServ.changePage(3);
    hotelServ.search('string');

    expect(hotelServ.pagination.curPage).toEqual(1);
  });

  it('changes price', () => {
    hotelServ.changePage(3);
    hotelServ.changePrice(100, 101);

    expect(hotelServ.pagination.curPage).toEqual(1);
  });

  it('changes sort', () => {
    hotelServ.changeSort('price');

    expect(hotelServ.sortBy).toEqual('price');
  });



});
