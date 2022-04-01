import { Restaurant } from './Schemas/resturants.schema';
import { RestaurantsService } from './resturants.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
let service: RestaurantsService;
let model: Model<Restaurant>;
const mockRestaurantService = {};
const mockRestaurant = {
  _id: '62162747788884d26decbc16',
  location: {
    type: 'Point',
    coordinates: [-97.393358, 42.044013],
    formattedAddress: '[900 - 910] Jonathon Cir, Norfolk, NE 68701-0866, US',
    city: 'Norfolk',
    state: 'NE',
    zipCode: '68701-0866',
    country: 'US',
  },
  images: [],
  category: 'Cafe',
  address: '252 Jonathon Circle',
  phoneNo: 23490958091,
  email: 'Timmy.Schaefer@yahoo.com',
  description: 'Investor',
  user: '621584bc656ea86059d807ac',
  name: 'Parisian Group',
  updatedAt: '2022-02-23T14:55:24.397Z',
  meals: ['62164a18c8a9e7b5f62eda99'],
};
describe('RestaurantsService', () => {
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        {
          provide: getModelToken(Restaurant.name),
          useValue: mockRestaurantService,
        },
      ],
    }).compile();
    service = module.get<RestaurantsService>(RestaurantsService);
    model = module.get<Model<Restaurant>>(getModelToken(Restaurant.name));
  });
  it('ahould be defined', () => {
    expect(service).toBeDefined();
  });
  describe('findAll', () => {
    it('shout return all restaurants', () => {
      jest.spyOn(model, 'find').mockImplementationOnce(() => ({
        limit: () => ({
          skip: jest.fn().mockReturnValue([mockRestaurant]),
        }),
      }));
    });
  });
});
