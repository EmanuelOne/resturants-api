import { AuthModule } from './../auth/auth.module';
import { MealSchema } from './schemas/meal.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MealController } from './meal.controller';
import { MealService } from './meal.service';
import { RestaurantsModule } from 'src/resturants/resturants.module';

@Module({
  imports: [
    AuthModule,
    RestaurantsModule,
    MongooseModule.forFeature([{ name: 'Meal', schema: MealSchema }]),
  ],
  controllers: [MealController],
  providers: [MealService],
})
export class MealModule {}
