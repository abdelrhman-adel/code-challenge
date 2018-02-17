import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingComponent } from './listing.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HotelsService } from '../../services/hotels.service';

class HotelServiceStub {
  searchData =  {
    date: {
      nights: 1
    }
  };
  search() { }
  changePrice() { }
}

const searchStr = 'search-sample';
const sampleRange = {
  from: 0,
  to: 10
};

describe('ListingComponent', () => {
  let component: ListingComponent;
  let fixture: ComponentFixture<ListingComponent>;
  let service: HotelsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListingComponent],
      providers: [{ provide: HotelsService, useClass: HotelServiceStub }],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(ListingComponent);
    component = fixture.componentInstance;
    service = TestBed.get(HotelsService);

  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should send search string to hotels service on changing search input', () => {
    component.search = searchStr;
    spyOn(service, 'search');

    component.searchChanged();

    expect(service.search).toHaveBeenCalledWith(searchStr);
  });

  it('should send range  to hotels service on changing range input', () => {
    spyOn(service, 'changePrice');

    component.rangeChanged(sampleRange);

    expect(service.changePrice).toHaveBeenCalledWith(sampleRange.from, sampleRange.to);
  });

});
