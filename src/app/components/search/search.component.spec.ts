import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HotelsService } from '../../services/hotels.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

class HotelServiceStub {
  setDate() { }
}

const formattedDate = {
  formatted: '10-10-2020 - 12-10-2020'
};

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let service: HotelsService;
  let router: Router;

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
    router = TestBed.get(Router);
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should send date to hotels service on submit', () => {
    component.dateInput = formattedDate;
    spyOn(service, 'setDate');
    spyOn(router, 'navigate');

    component.submitted();

    expect(service.setDate).toHaveBeenCalledWith('10-10-2020', '12-10-2020');
  });

  it('should redirect user to listing page on submit', () => {
    component.dateInput = formattedDate;
    spyOn(service, 'setDate');
    spyOn(router, 'navigate');

    component.submitted();

    expect(router.navigate).toHaveBeenCalledWith(['listing']);
  });
});
