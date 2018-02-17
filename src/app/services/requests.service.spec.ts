import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';

import { RequestsService } from './requests.service';

describe('RequestsService', () => {
  let reqServ: RequestsService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [RequestsService]
    });
    reqServ = TestBed.get(RequestsService);
  });

  it('should be created', inject([RequestsService], (service: RequestsService) => {
    expect(service).toBeTruthy();
  }));

  it('should return a subscription when get method is called', () => {
    expect(reqServ.get('', () => { }, () => { })).toEqual(jasmine.any(Subscription));
  });
});
