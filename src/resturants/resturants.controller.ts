import { Roles } from './../auth/decorators/roles.decorator';
import { RoleGuard } from './../auth/guards/role.guard';
import { User, UserRole } from './../auth/schemas/user.schema';
import { CurrentUser } from './../auth/decorators/current-user.decorator';
import { isValidMongoId } from './errors/mongoError.error';
import { GetRestaurantDTO } from './dto/get-restaurant.dto';
import { CreateRestaurantsDTO } from './dto/create-restaurants.dto';
import { Restaurant } from './Schemas/resturants.schema';
import { RestaurantsService } from './resturants.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UpdateRestaurantDTO } from './dto/uppdate-restaurant.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}
  @UseGuards(AuthGuard())
  @Get()
  async findAll(
    @Query() query: ExpressQuery,
    // @Req() req,
    @CurrentUser() user: User,
  ): Promise<Restaurant[]> {
    // const user = req.user;
    console.log(user);
    return await this.restaurantsService.findAll(query);
  }
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  async create(
    @Body() restaurant: CreateRestaurantsDTO,
    @CurrentUser() user: User,
  ): Promise<Restaurant> {
    return await this.restaurantsService.create(restaurant, user);
  }
  @UseGuards(AuthGuard())
  @Get(':id')
  async getRestaurant(@Param('id') id: string): Promise<Restaurant | object> {
    if (!isValidMongoId(id))
      return {
        message: 'Invalid Id',
        status: 400,
        error: true,
      };
    return await this.restaurantsService.findById(id);
  }
  @UseGuards(AuthGuard())
  @Put(':id')
  async updateRestaurant(
    @Param('id') id: string,
    @Body() restaurant: UpdateRestaurantDTO,
    @CurrentUser() user: User,
  ): Promise<Restaurant | object> {
    if (!isValidMongoId(id))
      return {
        message: 'Invalid Id',
        status: 400,
        error: true,
      };
    const res = await this.restaurantsService.findById(id);
    if (!res)
      return {
        message: 'Resturant does not exist',
        status: 400,
        error: true,
      };
    // console.log(res.user.toString(), user._id.toString());
    // console.log(res.user.equals(user._id));
    if (res.user.toString() !== user._id.toString())
      return {
        message: 'You are not authorized to update this restaurant',
        status: 400,
        error: true,
      };

    return await this.restaurantsService.update(id, restaurant);
  }
  @UseGuards(AuthGuard())
  @Delete()
  async deleteAllRestaurant() {
    return await this.restaurantsService.deleteAll();
  }
  @UseGuards(AuthGuard())
  @Delete(':id')
  async deleteRestaurant(
    @Param('id') id: string,
  ): Promise<Restaurant | object> {
    if (!isValidMongoId(id))
      return {
        message: 'Invalid Id',
        status: 400,
        error: true,
      };
    const resturant = await this.restaurantsService.findById(id);
    if (!resturant)
      return {
        message: 'Resturant does not exist',
        status: 400,
        error: true,
      };
    const deleteImages = await this.restaurantsService.deleteImages(id);

    await this.restaurantsService.delete(id);
    if (deleteImages)
      return {
        message: 'Resturant deleted successfully',
        status: 200,
        error: false,
      };
    return {
      message: 'Error Deleting Images',
      status: 400,
      error: true,
    };
  }
  @UseGuards(AuthGuard())
  @Put('/upload/:id')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    // console.log(id);
    if (!isValidMongoId(id))
      return {
        message: 'Invalid Id',
        status: 400,
        error: true,
      };
    return await this.restaurantsService.uploadFiles(id, files);
  }
}
