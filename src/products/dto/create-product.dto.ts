import { Category, Currency } from '@prisma/client';
import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
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
