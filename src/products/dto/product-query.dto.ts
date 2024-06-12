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
import { ApiPropertyOptional } from '@nestjs/swagger';

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
