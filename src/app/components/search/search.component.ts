import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { IMyDrpOptions } from 'mydaterangepicker';
import { HotelsService } from '../../services/hotels.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  // date input value
  dateInput;

  // ion range options
  myDateRangePickerOptions: IMyDrpOptions = {
    dateFormat: 'dd-mm-yyyy',
    editableDateRangeField: false,
    openSelectorOnInputClick: true,
  };

  /**
   * injects hotel service, router
   *
   * @param hotelServ hotels service reference
   * @param router Router reference
   */
  constructor(private hotelServ: HotelsService, public router: Router) { }

  /**
   * date range value change
   */
  submitted() {
    const dateRange = this.dateInput.formatted.split(' - ');
    this.hotelServ.setDate(dateRange[0], dateRange[1]);
    this.router.navigate(['listing']);
  }

}
