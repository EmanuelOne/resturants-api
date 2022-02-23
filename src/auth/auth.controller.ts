import { ResetPasswordDTO } from './dto/update-password.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { isValidMongoId } from './../resturants/errors/mongoError.error';
import { AuthGuard } from '@nestjs/passport';
import { loginDto } from './dto/login.dto';
import { User } from './schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UseGuards,
  Param,
} from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  RegisterUser(@Body() user: RegisterDto): Promise<User> {
    return this.authService.register(user);
  }
  @Post('login')
  login(@Body() user: loginDto): Promise<User> {
    return this.authService.loginUser(user);
  }
  @Get('admin')
  @UseGuards(AuthGuard())
  makeUserAdmin(@CurrentUser() user: User): Promise<any> {
    const id = user._id;
    return this.authService.makeAdmin(id);
  }

  @Get('users')
  @UseGuards(AuthGuard())
  getAllUsers(): Promise<User[]> {
    return this.authService.findAllUsers();
  }
  @Delete('users')
  deleteAllUsers(): Promise<any> {
    return this.authService.deleteAllUsers();
  }
  @Post('reset_password')
  resetPassword(@Body() data: ResetPasswordDTO): Promise<any> {
    return this.authService.resetPassword(data);
  }
}
