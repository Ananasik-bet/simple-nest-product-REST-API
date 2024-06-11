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

export class AuthSwaggerDto {
  @ApiProperty({
    description: 'User information',
    example: {
      id: 'bf9cd525-3b3b-4c6f-9de4-7be258448de2',
      createdAt: '2024-06-10T21:43:44.762Z',
      updatedAt: '2024-06-10T21:43:44.762Z',
      email: 'admin@gmail.com',
      name: 'Test Testovich',
      role: Role.ADMIN,
    },
  })
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    name?: string;
    role: Role;
  };

  @ApiProperty({
    description: 'Access token for authentication',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJmOWNkNTI1LTNiM2ItNGM2Zi05ZGU0LTdiZTI1ODQ0OGRlMiIsImlhdCI6MTcxODEyNjQyMSwiZXhwIjoxNzE4MTMwMDIxfQ.aBZHnssIjX0FEQ-UIgDmThesceV4DRWVc4aXVf_jMb4',
  })
  accessToken: string;
}
