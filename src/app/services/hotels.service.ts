import { Injectable } from '@angular/core';
import { RequestsService } from './requests.service';
import { Hotel } from '../models/hotel';
import { DateService } from './date.service';

@Injectable()
export class HotelsService {
  private url = 'https://api.myjson.com/bins/tl0bp';
  private hotels: Hotel[] = [];
  public filteredHotels: Hotel[] = [];
  searchData = {
    date: {
      from: '10-10-2020',
      to: '12-10-2020',
      nights: 3
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
  perPage = 4;
  curPage = 1;

  constructor(private requests: RequestsService, private date: DateService) {
    this.getHotels();
  }
  getHotels() {

    this.requests.get(
      this.url,
      err => {
      }, data => {
        if (data.hotels) {
          const prices = [];
          data.hotels.forEach(element => {
            this.hotels.push(new Hotel(element));
            prices.push(element.price);
          });
          this.calcInitialPrice(prices);
          this.filterResults();
        }
      }
    );
  }

  calcInitialPrice(prices) {
    this.searchData.price.from =
      this.searchData.price.min = Math.min(...prices);
    this.searchData.price.to =
      this.searchData.price.max = Math.max(...prices);
  }

  calcNights() {
    if (this.searchData.date.from && this.searchData.date.to) {
      this.searchData.date.nights =
        this.date.getDaysBetween(this.searchData.date.from, this.searchData.date.to);
    }
  }
  filterResults() {
    if (this.searchData.date.nights > 0) {
      this.filteredHotels = [];
      this.filteredHotels = this.hotels.filter((hotel: Hotel) => {
        if (
          this.searchData.name
          && hotel.name.toLowerCase().indexOf(this.searchData.name.toLowerCase()) === -1
        ) {
          return false;
        }
        if (
          this.searchData.price.from > hotel.price
          || this.searchData.price.to < hotel.price
        ) {
          return false;
        }
        return this.checkAvailability(hotel.availability);
      });
    }
    console.log(this.filteredHotels);
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
      this.searchData.name = searchStr;
      this.filterResults();
    }
  }

  changePrice(from, to) {
    this.searchData.price.from = from;
    this.searchData.price.to = to;
    this.filterResults();
  }

}
