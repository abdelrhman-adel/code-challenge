import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { IMyDrpOptions } from 'mydaterangepicker';
import { HotelsService } from '../../services/hotels.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  dateInput;
  myDateRangePickerOptions: IMyDrpOptions = {
    dateFormat: 'dd-mm-yyyy',
    editableDateRangeField: false,
    openSelectorOnInputClick: true,
  };
  constructor(private hotelServ: HotelsService, public router: Router) { }

  ngOnInit() {
  }

  submitted() {
    const dateRange = this.dateInput.formatted.split(' - ');
    this.hotelServ.setDate(dateRange[0], dateRange[1]);
    this.router.navigate(['listing']);
  }

}
