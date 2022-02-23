import { User } from './../../auth/schemas/user.schema';
import { Category } from './../Schemas/resturants.schema';
import {
  IsEmail,
  IsString,
  IsPhoneNumber,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
export class CreateRestaurantsDTO {
  readonly user: User;
  @IsString()
  readonly name: string;
  @IsString()
  readonly description: string;
  @IsEmail()
  readonly email: string;
  @IsPhoneNumber()
  readonly phoneNo: number;
  @IsString()
  readonly address: string;
  @IsNotEmpty()
  @IsEnum(Category, {
    message: `Please select a valid category from the list below ${JSON.stringify(
      Object.values(Category),
    )}`,
  })
  readonly category: Category;
}
