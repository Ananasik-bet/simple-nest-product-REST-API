import { Category, Currency } from '@prisma/client';
import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

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
