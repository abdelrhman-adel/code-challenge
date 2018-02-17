import { Hotel } from './hotel';

describe('Hotel', () => {
  let hotelModel: Hotel;
  const data = {
    price: 1,
    availability: 2,
    city: 3,
    name: 4,
  };

  beforeEach(() => {
    hotelModel = new Hotel(data);
  });

  it('should create an instance', () => {
    expect(hotelModel).toBeTruthy();
  });
  it('should have parameters declared', () => {
    expect(hotelModel.price).toBe(1);
    expect(hotelModel.availability).toBe(2);
    expect(hotelModel.city).toBe(3);
    expect(hotelModel.name).toBe(4);
  });
});
