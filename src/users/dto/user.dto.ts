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

export class UserDtoSwagger {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '30e5f67c-b829-4546-8bb1-93ed31619a01',
  })
  id: string;

  @ApiProperty({
    description: 'The timestamp when the user was created',
    example: '2024-06-10T18:19:06.130Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The timestamp when the user was last updated',
    example: '2024-06-10T18:19:06.130Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'my.email@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'Test Testovich',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'USER',
    enum: Role,
    enumName: 'Role',
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
