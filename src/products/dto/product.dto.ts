import { Category, Currency } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  Min,
  IsInt,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @IsString()
  @ApiProperty({
    example: 'Product Name',
    description: 'Name of the product',
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'This is a great product.',
    description: 'Description of the product',
  })
  description?: string;

  @IsNumber()
  @ApiProperty({
    example: 29.99,
    description: 'Price of the product',
  })
  price: number;

  @IsEnum(Currency)
  @ApiProperty({
    example: Currency.USD,
    description: 'Currency of the product price',
    enum: Currency,
  })
  currency: Currency;

  @IsEnum(Category)
  @ApiProperty({
    example: Category.ELECTRONICS,
    description: 'Category of the product',
    enum: Category,
  })
  category: Category;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Updated Product Name',
    description: 'Updated name of the product',
  })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'This is an updated description of the product.',
    description: 'Updated description of the product',
  })
  description?: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    example: 34.99,
    description: 'Updated price of the product',
  })
  price?: number;

  @IsOptional()
  @IsEnum(Currency)
  @ApiPropertyOptional({
    example: Currency.EUR,
    description: 'Updated currency of the product price',
    enum: Currency,
  })
  currency?: Currency;

  @IsOptional()
  @IsEnum(Category)
  @ApiPropertyOptional({
    example: Category.FASHION,
    description: 'Updated category of the product',
    enum: Category,
  })
  category?: Category;
}

export class GetListQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  @ApiPropertyOptional({
    example: 15,
    description: 'Limit of items per page',
  })
  limit?: number = 15;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  @ApiPropertyOptional({
    example: 1,
    description: 'Page number',
  })
  page?: number = 1;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Product Name',
    description: 'Filter products by name',
  })
  name?: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    example: 29.99,
    description: 'Filter products by price',
  })
  price?: number;

  @IsOptional()
  @IsEnum(Currency)
  @ApiPropertyOptional({
    example: Currency.USD,
    description: 'Filter products by currency',
    enum: Currency,
  })
  currency?: Currency;

  @IsOptional()
  @IsEnum(Category)
  @ApiPropertyOptional({
    example: Category.ELECTRONICS,
    description: 'Filter products by category',
    enum: Category,
  })
  category?: Category;
}

export class ProductSwaggerDto {
  @ApiProperty({
    description: 'Unique identifier for the product',
    example: 'e7c3cae7-a8c6-4858-9169-492525bf4479',
  })
  id: string;

  @ApiProperty({
    description: 'Date and time when the product was created',
    example: '2024-06-11T09:05:38.935Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time when the product was last updated',
    example: '2024-06-11T09:05:38.935Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Name of the product',
    example: 'Product 1',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'Desc for product 1',
  })
  description: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 1.01,
  })
  price: number;

  @ApiProperty({
    description: 'Currency in which the price is expressed',
    enum: Currency,
    example: 'USD',
  })
  currency: Currency;

  @ApiProperty({
    description: 'Category to which the product belongs',
    enum: Category,
    example: 'ELECTRONICS',
  })
  category: Category;

  @ApiProperty({
    description: 'Identifier of the user who owns the product',
    example: 'bf9cd525-3b3b-4c6f-9de4-7be258448de2',
  })
  userId: string;

  @ApiProperty({
    description: 'Information about the user who owns the product',
    example: {
      name: 'Test Testovich',
      email: 'admin@gmail.com',
    },
  })
  user: {
    name: string;
    email: string;
  };
}
