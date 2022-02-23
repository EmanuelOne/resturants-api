import { Meal } from './../../meal/schemas/meal.schema';
import { Restaurant } from './../../resturants/Schemas/resturants.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;
  @Prop({ unique: true })
  email: string;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }] })
  restaurants: Restaurant[];
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }] })
  meals: Meal[];
  @Prop({ select: false })
  password: string; // select: false means that this field will not be returned when querying the database
  @Prop({
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
