import { isValidMongoId } from './../resturants/errors/mongoError.error';
import { CreateMealDto } from './dto/create-meal.dto';
import { User } from './../auth/schemas/user.schema';
import { Restaurant } from './../resturants/Schemas/resturants.schema';
import { Meal } from './schemas/meal.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
@Injectable()
export class MealService {
  constructor(
    @InjectModel(Meal.name)
    private readonly mealModel: Model<Meal>,
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<Restaurant>,
  ) {}
  //   create a new meal  ==> POST /api/meal
  async create(meal: Meal, user: User): Promise<any> {
    const data = Object.assign(meal, { user: user._id.toString() });
    // Saving mealId in the restaurant
    if (!isValidMongoId(meal.restaurant))
      return {
        message: 'Invalid Restaurant Id',
        status: 404,
      };
    const restaurant = await this.restaurantModel.findById(data.restaurant);
    // console.log(restaurant);
    if (!restaurant) {
      throw new NotFoundException('Restaurant does not exist');
    }
    if (!restaurant.user.equals(user._id)) {
      throw new UnauthorizedException('You are not authorized to create meal');
    }
    const newMeal = new this.mealModel(data);
    restaurant.meals.push(newMeal);
    await restaurant.save();
    const dat = await newMeal.save();
    return dat;
  }
  async findAll(query: any): Promise<Meal[]> {
    const keyword = query.keyword
      ? {
          name: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};
    const page = Number(query.page) || 1;
    const perPage = 100;
    const skip = perPage * (page - 1);
    const meals = await this.mealModel
      .find({ ...keyword })
      .skip(skip)
      .limit(perPage);
    return meals;
  }
  async findById(id: string): Promise<Meal> {
    try {
      const meal = await this.mealModel.findById(id);
      if (!meal) throw new NotFoundException('Meal does not exist');
      return meal;
    } catch (err) {
      throw new NotFoundException('Meal does not exist');
    }
  }
  async update(id: string, meal: Meal): Promise<any> {
    try {
      const updatedMeal = await this.mealModel.findByIdAndUpdate(id, meal, {
        new: true,
        runValidators: true,
      });
      if (!updatedMeal) throw new NotFoundException('Error Updating Meal');
      return {
        message: 'Meal Updated',
        error: false,
        status: 200,
      };
    } catch (err) {
      throw new NotFoundException('Meal does not exist');
    }
  }
  async delete(id: string) {
    try {
      if (!isValidMongoId(id))
        return {
          message: 'Invalid Id',
          status: 400,
          error: true,
        };
      const deletedMeal = await this.mealModel.findByIdAndDelete(id);
      await this.restaurantModel.updateOne(
        { meals: id },
        { $pull: { meals: id } },
      );
      if (!deletedMeal) throw new NotFoundException('Meal already deleted');
      return {
        message: 'Meal Deleted',
        error: false,
        status: 200,
      };
    } catch (err) {
      throw new NotFoundException('Meal does not exist');
    }
  }
}
