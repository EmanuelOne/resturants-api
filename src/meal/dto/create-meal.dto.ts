import {
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { User } from './../../auth/schemas/user.schema';
import { Restaurant } from './../../resturants/Schemas/resturants.schema';
import { MealCategory } from './../schemas/meal.schema';

export class CreateMealDto {
  readonly _id: string;
  @IsNotEmpty()
  @IsString()
  readonly name: string;
  @IsNotEmpty()
  @IsString()
  readonly description: string;
  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  readonly image?: string[];
  @IsNotEmpty()
  @IsEnum(MealCategory, {
    message: `Please select a valid category from the list below ${JSON.stringify(
      Object.values(MealCategory),
    )}`,
  })
  readonly category: MealCategory;
  @IsNotEmpty()
  readonly restaurant: string;
  @IsEmpty({ message: 'User is not allowed to be set' })
  readonly user: User;
}
