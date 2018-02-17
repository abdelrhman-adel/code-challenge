
/**
 * hotel's model
 */
export class Hotel {
  availability;
  city;
  name;
  price;
  constructor(data) {
    this.availability = data.availability;
    this.city = data.city;
    this.name = data.name;
    this.price = data.price;
  }
}
