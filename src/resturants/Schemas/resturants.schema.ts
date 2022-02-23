import { Meal } from './../../meal/schemas/meal.schema';
import { User } from './../../auth/schemas/user.schema';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export enum Category {
  FAST_FOOD = 'Fast Food',
  CAFE = 'Cafe',
  FINE_DINNING = 'Fine Dinning',
}
@Schema()
export class Location {
  @Prop({ type: String, enum: ['Point'] })
  type: string;
  @Prop({ index: '2dsphere' })
  coordinates: number[];
  @Prop()
  formattedAddress: string;
  @Prop()
  city: string;
  @Prop()
  state: string;
  @Prop()
  zipCode: string;
  @Prop()
  country: string;
}

@Schema({
  timestamps: true,
})
export class Restaurant {
  @Prop()
  name: string;
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop()
  description: string;

  @Prop()
  email: string;

  @Prop()
  phoneNo: number;

  @Prop()
  address: string;

  @Prop()
  category: Category;

  @Prop()
  images?: object[];
  @Prop({ type: Object, ref: 'Location' })
  location?: Location;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }] })
  meals?: Meal[];
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
