import { updateMealDto } from './dto/update-meal.dto';
import { AuthGuard } from '@nestjs/passport';
import { Meal } from './schemas/meal.schema';
import { User } from './../auth/schemas/user.schema';
import { CreateMealDto } from './dto/create-meal.dto';
import { MealService } from './meal.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Delete,
  Put,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('meals')
export class MealController {
  constructor(private mealService: MealService) {}
  @Post()
  @UseGuards(AuthGuard())
  createMeal(
    @Body() createMealDto: CreateMealDto,
    @CurrentUser() user: User,
  ): Promise<Meal> {
    return this.mealService.create(createMealDto, user);
  }
  @Get()
  @UseGuards(AuthGuard())
  getAllMeals(@CurrentUser() user: User): Promise<Meal[]> {
    return this.mealService.findAll(user);
  }
  @Get('/:id')
  @UseGuards(AuthGuard())
  getMeal(@Param('id') id: string): Promise<Meal> {
    return this.mealService.findById(id);
  }
  @Put('/:id')
  @UseGuards(AuthGuard())
  updateMeal(
    @Param('id') id: string,
    @Body() updateMealDto: updateMealDto,
  ): Promise<Meal> {
    return this.mealService.update(id, updateMealDto);
  }
  @Delete('/:id')
  @UseGuards(AuthGuard())
  deleteMeal(@Param('id') id: string): Promise<any> {
    return this.mealService.delete(id);
  }
}
