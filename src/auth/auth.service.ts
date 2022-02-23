import { ResetPasswordDTO } from './dto/update-password.dto';
import { JwtService } from '@nestjs/jwt';
import { loginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User, UserRole } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import apiFeature from 'src/utils/apiFeature.utils';

import * as bcrypt from 'bcryptjs';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}
  //   Register a new user > Post /auth/register
  async register(user: RegisterDto): Promise<any> {
    // eslint-disable-next-line prefer-const
    let { password, ...rest } = user;
    const salt = await bcrypt.genSalt();
    try {
      password = await bcrypt.hash(password, salt);
      const newUser = new this.userModel({
        password,
        ...rest,
      });
      await newUser.save();
      return {
        error: false,
        message: 'User registered Successfully',
        status: 201,
      };
    } catch (err) {
      //   console.log(err);
      if (err.code === 11000) {
        throw new ConflictException('email already used');
      }
    }
  }
  async loginUser(user: loginDto): Promise<any> {
    const { email, password } = user;
    const foundUser = await this.userModel
      .findOne({ email })
      .select('+password');
    if (!foundUser) throw new UnauthorizedException('Invalid Email');
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) throw new UnauthorizedException('Invalid password');
    const token = await apiFeature.assignJwtToken(
      foundUser._id,
      this.jwtService,
    );
    return {
      error: false,
      message: 'User logged in successfully',
      status: 200,
      data: {
        token,
      },
    };
  }
  async makeAdmin(id: string): Promise<any> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User does not exist');
    await this.userModel.findByIdAndUpdate(id, {
      role: UserRole.ADMIN,
    });
    return {
      error: false,
      message: 'User made admin successfully',
      status: 200,
    };
  }
  async resetPassword(data: ResetPasswordDTO): Promise<any> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const user = await this.userModel.findOneAndUpdate(
      { email: data.email },
      { password: hashedPassword },
    );
    if (!user) throw new NotFoundException('User does not exist');
    return {
      error: false,
      message: 'User password reset successfully',
      status: 200,
    };
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email });
  }
  async findAllUsers(): Promise<User[]> {
    return await this.userModel.find();
  }
  async deleteAllUsers(): Promise<any> {
    return await this.userModel.deleteMany({});
  }
}
