import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HotelsService } from '../../services/hotels.service';
import { RouterTestingModule } from '@angular/router/testing';

class HotelServiceStub {
  setDate() { }
}

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let service: HotelsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [SearchComponent],
      providers: [{ provide: HotelsService, useClass: HotelServiceStub }],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    service = TestBed.get(HotelsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send date to hotels service on submit', () => {
    component.dateInput = {
      formatted: '10-10-2020 - 12-10-2020'
    };
    spyOn(service, 'setDate');

    component.submitted();

    expect(service.setDate).toHaveBeenCalledWith('10-10-2020', '12-10-2020');
  });
});
