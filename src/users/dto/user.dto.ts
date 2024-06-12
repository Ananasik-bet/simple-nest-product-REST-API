import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @IsOptional()
  @IsEmail()
  @ApiProperty({
    example: 'example@gmail.com',
    required: false,
  })
  email: string;

  @IsOptional()
  @MinLength(6, {
    message: 'Password must be at least 6 characters long.',
  })
  @IsString()
  @ApiProperty({
    example: 'Hard password 1234',
    required: false,
    minLength: 6,
  })
  password: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'John Doe',
    required: false,
  })
  name?: string;

  @IsOptional()
  @IsEnum(Role)
  @ApiProperty({
    example: Role.USER,
    required: false,
    enum: Role,
  })
  role?: Role;
}
