import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
export class loginDto {
  _id: string;
  @IsEmail({}, { message: 'Email is not valid,Enter Correct email' })
  email: string;
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
