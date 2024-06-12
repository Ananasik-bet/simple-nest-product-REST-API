import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthDto {
  @IsEmail()
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'Email address of the user',
  })
  email: string;

  @MinLength(6, {
    message: 'Password must be at least 6 characters long.',
  })
  @IsString()
  @ApiProperty({
    example: 'HardPassword1234',
    description: 'Password of the user. Must be at least 6 characters long.',
    minLength: 6,
  })
  password: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'Name of the user. Optional field.',
  })
  name?: string;

  @IsOptional()
  @IsEnum(Role)
  @ApiPropertyOptional({
    example: Role.USER,
    description: 'Role of the user. Optional field.',
    enum: Role,
  })
  role?: Role;
}
