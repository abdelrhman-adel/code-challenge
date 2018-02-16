import { Component, OnInit } from '@angular/core';
import { HotelsService } from '../../services/hotels.service';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {
  search;

  constructor(public hotelServ: HotelsService) { }

  ngOnInit() {

  }
  searchChanged() {
    this.hotelServ.search(this.search);
  }
  rangeChanged(e) {
    const from = e.from / this.hotelServ.searchData.date.nights,
      to = e.to / this.hotelServ.searchData.date.nights;
    this.hotelServ.changePrice(from, to);
  }

}
