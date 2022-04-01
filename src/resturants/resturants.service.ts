import { User } from './../auth/schemas/user.schema';
import { Restaurant } from './Schemas/resturants.schema';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import ApiFeatures from '../utils/apiFeature.utils';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly resturantModel: Model<Restaurant>,
  ) {}
  //   Get All Resturants > Get /resturants
  async findAll(query): Promise<Restaurant[]> {
    const keyword = query.keyword
      ? {
          name: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};
    const page = Number(query.page) || 1;
    const perPage = 10;
    const skip = perPage * (page - 1);
    const resturants = await this.resturantModel
      .find({ ...keyword })
      .skip(skip)
      .limit(perPage);
    return resturants;
  }
  //   Create A new Resturant > Post /resturants
  async create(resturant: Restaurant, user: User): Promise<Restaurant> {
    const location = await ApiFeatures.setRestaurantLocation(resturant.address);
    // console.log(location);
    const data = Object.assign(resturant, {
      location,
      user: user._id.toString(),
    });
    const newResturant = new this.resturantModel(data);
    return await newResturant.save();
  }
  //   Get A Resturant > Get /resturants/:id
  async findById(id: string): Promise<Restaurant> {
    try {
      const resturant = await this.resturantModel.findById(id);
      if (!resturant) throw new NotFoundException('Resturant does not exist');
      return resturant;
    } catch (err) {
      throw new NotFoundException('Resturant does not exist');
    }
  }
  //   Update A Resturant > Put /resturants/:id
  async update(id: string, resturant: Restaurant): Promise<Restaurant> {
    try {
      const updatedResturant = await this.resturantModel.findByIdAndUpdate(
        id,
        resturant,
        { new: true, runValidators: true },
      );
      return updatedResturant;
    } catch (err) {
      throw new NotFoundException('Resturant does not exist');
    }
  }
  //   Delete A Resturant > Delete /resturants/:id
  async delete(id: string) {
    try {
      const deletedResturant = await this.resturantModel.findByIdAndDelete(id);
      if (!deletedResturant)
        throw new NotFoundException('Resturant already deleted');
      return {
        message: 'Resturant Deleted',
        success: true,
      };
    } catch (err) {
      // console.log
      throw new NotFoundException('Resturant does not exist');
    }
  }
  async deleteAll(): Promise<object> {
    try {
      await this.resturantModel.deleteMany();

      return { message: 'All Resturants Deleted' };
    } catch (err) {
      // console.log
      throw new NotFoundException('Resturant does not exist');
    }
  }
  //   Upload A Resturant Image > Put /resturants/upload/:id
  async uploadFiles(id: string, files: any) {
    const resturant = await this.resturantModel.findById(id);
    if (!resturant) throw new NotFoundException('Resturant does not exist');
    try {
      const images = await ApiFeatures.uploadFiles(files);
      await this.resturantModel.findByIdAndUpdate(
        id,
        {
          images: images,
        },
        { new: true },
      );
      return {
        message: 'Resturant Image Uploaded',
        images: images,
        success: true,
      };
    } catch (err) {
      throw new NotFoundException('Resturant does not exist');
    }
  }
  async deleteImages(id: string): Promise<boolean> {
    const resturant = await this.resturantModel.findById(id);
    if (!resturant) throw new NotFoundException('Resturant does not exist');
    if (!resturant.images) return true;
    const res = await ApiFeatures.deleteFiles(resturant.images);
    return res;
  }
}
