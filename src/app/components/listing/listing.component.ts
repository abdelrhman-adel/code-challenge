import { Component } from '@angular/core';

import { HotelsService } from '../../services/hotels.service';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent {

  // search value
  search;

  /**
   * injects hotel service
   *
   * @param hotelServ hotels service reference
   */
  constructor(public hotelServ: HotelsService) { }

  /**
   * method to be executed on changing search input value
   */
  searchChanged() {
    this.hotelServ.search(this.search);
  }

  /**
   * method to be executed on changing price range slider
   *
   * @param e event contains price range
   */
  rangeChanged(e) {
    const from = e.from / this.hotelServ.searchData.date.nights,
      to = e.to / this.hotelServ.searchData.date.nights;
    this.hotelServ.changePrice(from, to);
  }

}
