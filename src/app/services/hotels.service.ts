import { Injectable } from '@angular/core';

import { Hotel } from '../models/hotel';

import { RequestsService } from './requests.service';
import { DateService } from './date.service';


/**
 * A service to manage hotels data : fetch, filter, sort and pagination
 *
 * @constructor fetchs hotels from the api
*/
@Injectable()
export class HotelsService {

  // Api endpoint url to fetch hotels
  private url = 'https://api.myjson.com/bins/tl0bp';

  // is the fetching request finished or no
  public loaded = false;

  // all the hotels fetched from Api
  public hotels: Hotel[] = [];

  // hotels that matchs filtering and sorting criteria
  public filteredHotels: Hotel[] = [];

  // the current displayed hotels, depends on the pagination
  public displayHotels: Hotel[] = [];

  // search data to be used in filtering contains: date, search string and price
  searchData = {
    date: {
      from: '',
      to: '',
      nights: 1
    },
    name: '',
    price: {
      from: 0,
      to: 0,
      min: 0,
      max: 0
    }
  };

  // sort by name or price
  sortBy = 'name';

  // pagination data
  pagination = {
    perPage: 4,
    curPage: 1,
    pages: [],
  };

  /**
   * gets the hotels initially with the start of the app
   *
   * @param requests a service that handles http requests
   * @param date a service to handle date calculations
   */
  constructor(private requests: RequestsService, private date: DateService) {
    this.getHotels();
  }

  /**
   * an initial method that uses requests service to fetch data from api
   *
   * @param callBack function to be executed after the request succeeds
   */
  getHotels(callBack = () => { }) {
    this.loaded = false;
    this.requests.get(
      this.url,
      err => { this.loaded = true; }, // error callback
      data => { // success callback
        if (data.hotels) {
          this.loaded = true;
          this.prepareHotels(data.hotels);
          callBack();
        }
      }
    );
  }

  /**
   * prepare the data fetched from Api
   *
   * @param hotels array of hotel objects fetched from Api
   */
  prepareHotels(hotels) {
    hotels.forEach(element => {
      this.hotels.push(new Hotel(element));
    });
    this.calcInitialPrice();
  }

  /**
   * refresh data when the api request fails it gets the hotels then apply filters
   */
  refresh() {
    this.getHotels(() => {
      this.filterResults();
    });
  }

  /**
   * calcualtes price range to filter with
   *
   * @param prices array containing all hotels prices
   */
  calcInitialPrice() {
    const prices = [];
    this.hotels.forEach(element => {
      prices.push(element.price);
    });
    const min = Math.min(...prices),
      max = Math.max(...prices);
    this.searchData.price = {
      from: min,
      min,
      to: max,
      max
    };
  }

  /**
   * filter hotels to match search criteria
   */
  filterResults() {
    if (this.searchData.date.nights > 0) {
      this.filteredHotels = this.hotels.filter((hotel: Hotel) => {
        // if it matches search criteria && the price within the selected range && the time range is available
        return this.findByName(hotel) && this.findByPrice(hotel) && this.isAvailable(hotel.availability);
      });
      this.sortResults();
      this.getPagesCount();
      this.getDisplayHotels();
    }
  }

  /**
   * if the hotel matchs search criteria
   *
   * @param hotel Hotel Model
   */
  findByName(hotel) {
    return !this.searchData.name || hotel.name.toLowerCase().indexOf(this.searchData.name.toLowerCase()) !== -1;
  }

  /**
   * if the hotel's price is withing the selected range
   *
   * @param hotel Hotel Model
   */
  findByPrice(hotel) {
    return this.searchData.price.from <= hotel.price && this.searchData.price.to >= hotel.price;
  }

  /**
   * if the hotel's price is withing the selected range
   *
   * @param availability Hotel's array of available date ranges
   */
  isAvailable(availability) {
    for (let i = 0; i < availability.length; i++) {
      if (
        this.date.isBetween(this.searchData.date.from, availability[i])
        && this.date.isBetween(this.searchData.date.to, availability[i])
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * calculate pages app needs to list all the filtered results
   */
  getPagesCount() {
    this.pagination.pages = [];
    const count = Math.ceil(this.filteredHotels.length / this.pagination.perPage);
    for (let i = 1; i <= count; i++) {
      this.pagination.pages.push(i);
    }
  }

  /**
   * get the hotels to be displayed in the current page
   */
  getDisplayHotels() {
    if (this.pagination.pages.length > 1) {
      const skip = ((this.pagination.curPage - 1) * this.pagination.perPage);
      this.displayHotels = this.filteredHotels.slice(skip, skip + this.pagination.perPage);
    } else {
      this.displayHotels = [...this.filteredHotels];
    }
  }

  /**
   * change the current page by page number
   *
   * @param page page number to change to
   */
  changePage(page) {
    this.pagination.curPage = page;
    this.getDisplayHotels();
  }

  /**
   * set date range to filter with then apply's filters
   *
   * @param from the start of the date range
   * @param to the end of the date range
   */
  setDate(from, to) {
    this.searchData.date.from = from;
    this.searchData.date.to = to;
    this.calcNights();
    this.clearFilters();
    this.filterResults();
  }

  /**
   * clears all filters to reset the filtering
   */
  clearFilters() {
    this.resetPagination();
    this.calcInitialPrice();
    this.searchData.name = '';
  }

  /**
   * calculate nights between the range selected
   */
  calcNights() {
    if (this.searchData.date.from && this.searchData.date.to) {
      this.searchData.date.nights =
        this.date.getDaysBetween(this.searchData.date.from, this.searchData.date.to);
    }
  }

  /**
   * change's search value then filters results
   *
   * @param searchStr a string to search with
   */
  search(searchStr) {
    if (this.searchData.name !== searchStr) {
      this.resetPagination();
      this.searchData.name = searchStr;
      this.filterResults();
    }
  }

  /**
   * change price's range then filters results
   *
   * @param from minimum price
   * @param to maximum price
   */
  changePrice(from, to) {
    if (this.searchData.price.from !== from
      || this.searchData.price.to !== to) {
      this.resetPagination();
      this.searchData.price.from = from;
      this.searchData.price.to = to;
      this.filterResults();
    }
  }

  /**
   * reset pagination to start from page 1
   */
  resetPagination() {
    this.pagination.curPage = 1;
  }

  /**
   * changes the key to sort by
   *
   * @param by the field to sort by ( either name or price )
   */
  changeSort(by) {
    this.sortBy = by;
    this.sortResults();
    this.resetPagination();
    this.getDisplayHotels();
  }

  /**
   * apply sorting with selected key
   */
  sortResults() {
    if (this.sortBy === 'name') {
      this.filteredHotels.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    } else {
      this.filteredHotels.sort((a, b) => {
        return a.price - b.price;
      });
    }
  }

}
