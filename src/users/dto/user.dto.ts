import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '@prisma/client';

export class UserDto {
  @IsOptional()
  @IsEmail()
  email: string;
  @IsOptional()
  @MinLength(6, {
    message: 'Password must be at least 6 characters long.',
  })
  @IsString()
  password: string;
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
