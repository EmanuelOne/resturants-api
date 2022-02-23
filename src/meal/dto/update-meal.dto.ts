import {
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { User } from './../../auth/schemas/user.schema';
import { MealCategory } from './../schemas/meal.schema';

export class updateMealDto {
  readonly _id: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;

  readonly image?: string[];
  readonly category: MealCategory;
  readonly restaurant: string;
  @IsEmpty({ message: 'User is not allowed to be set' })
  readonly user: User;
}
