import { Injectable } from '@angular/core';
import { RequestsService } from './requests.service';
import { Hotel } from '../models/hotel';
import { DateService } from './date.service';

@Injectable()
export class HotelsService {
  private url = 'https://api.myjson.com/bins/tl0bp';
  private hotels: Hotel[] = [];
  public filteredHotels: Hotel[] = [];
  public displayHotels: Hotel[] = [];
  public loaded = false;
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
  sortBy = 'name';
  pagination = {
    perPage: 4,
    curPage: 1,
    pages: [],
  };

  constructor(private requests: RequestsService, private date: DateService) {
    this.getHotels();
  }
  getHotels(callBack = () => { }) {
    this.loaded = false;
    this.requests.get(
      this.url,
      err => {
        this.loaded = true;
      }, data => {
        if (data.hotels) {
          const prices = [];
          data.hotels.forEach(element => {
            this.hotels.push(new Hotel(element));
            prices.push(element.price);
          });
          this.calcInitialPrice(prices);
          this.loaded = true;
          callBack();
          this.filterResults();
        }
      }
    );
  }
  refresh() {
    this.getHotels(() => {
      this.filterResults();
    });
  }

  calcInitialPrice(prices) {
    const min = Math.min(...prices),
      max = Math.max(...prices);
    this.searchData.price = {
      from: min,
      min,
      to: max,
      max
    };
  }

  calcNights() {
    if (this.searchData.date.from && this.searchData.date.to) {
      this.searchData.date.nights =
        this.date.getDaysBetween(this.searchData.date.from, this.searchData.date.to);
    }
  }
  filterResults() {
    if (this.searchData.date.nights > 0) {
      this.filteredHotels = this.hotels.filter((hotel: Hotel) => {
        if (
          !this.findByName(hotel) ||
          !this.findByPrice(hotel) ||
          !this.checkAvailability(hotel.availability)
        ) {
          return false;
        } else {
          return true;
        }
      });
      this.sortResults();
      this.getPagesCount();
      this.getDisplayHotels();
    }
  }
  findByName(hotel) {
    if (
      this.searchData.name
      && hotel.name.toLowerCase().indexOf(this.searchData.name.toLowerCase()) === -1
    ) {
      return false;
    } else {
      return true;
    }
  }
  findByPrice(hotel) {
    if (
      this.searchData.price.from > hotel.price
      || this.searchData.price.to < hotel.price
    ) {
      return false;
    } else {
      return true;
    }

  }
  getPagesCount() {
    this.pagination.pages = [];
    const count = Math.ceil(this.filteredHotels.length / this.pagination.perPage);
    for (let i = 1; i <= count; i++) {
      this.pagination.pages.push(i);
    }
  }
  getDisplayHotels() {
    if (this.filteredHotels.length > this.pagination.perPage) {
      const skip = ((this.pagination.curPage - 1) * this.pagination.perPage);
      this.displayHotels = this.filteredHotels.slice(skip, skip + this.pagination.perPage);
    } else {
      this.displayHotels = [...this.filteredHotels];
    }
  }

  changePage(page) {
    this.pagination.curPage = page;
    this.getDisplayHotels();
  }

  checkAvailability(availability) {
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

  setDate(from, to) {
    this.searchData.date.from = from;
    this.searchData.date.to = to;
    this.calcNights();
    this.filterResults();
  }

  search(searchStr) {
    if (this.searchData.name !== searchStr) {
      this.pagination.curPage = 1;
      this.searchData.name = searchStr;
      this.filterResults();
    }
  }

  changePrice(from, to) {
    if (this.searchData.price.from !== from
      || this.searchData.price.to !== to) {
      this.pagination.curPage = 1;
      this.searchData.price.from = from;
      this.searchData.price.to = to;
      this.filterResults();
    }
  }

  changeSort(by) {
    this.sortBy = by;
    this.sortResults();
    this.pagination.curPage = 1;
    this.getDisplayHotels();
  }
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
