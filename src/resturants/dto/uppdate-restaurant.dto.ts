import { User } from './../../auth/schemas/user.schema';
import { Category } from './../Schemas/resturants.schema';
export class UpdateRestaurantDTO {
  readonly user: User;
  readonly name: string;
  readonly description: string;
  readonly email: string;
  readonly phoneNo: number;
  readonly address: string;
  readonly category: Category;
}
