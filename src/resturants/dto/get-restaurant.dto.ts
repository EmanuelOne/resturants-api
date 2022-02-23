import { IsNumberString } from 'class-validator';
export class GetRestaurantDTO {
  @IsNumberString()
  id: number;
}
