import { Restaurant } from './../../resturants/Schemas/resturants.schema';
import { User } from './../../auth/schemas/user.schema';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export enum MealCategory {
  SOUPS = 'Soups',
  SALADS = 'Salads',
  SANDWICHES = 'Sandwiches',
  PASTA = 'Pasta',
}

@Schema({
  timestamps: true,
})
export class Meal {
  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop()
  price: number;
  @Prop()
  image?: string[];
  @Prop()
  category: MealCategory;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' })
  restaurant: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const MealSchema = SchemaFactory.createForClass(Meal);
