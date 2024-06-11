import { Category, Currency } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsUUID,
  IsEnum,
  Min,
  IsInt,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @IsEnum(Currency)
  currency: Currency;

  @IsEnum(Category)
  category: Category;

  @IsUUID()
  userId: string;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

  @IsOptional()
  @IsEnum(Category)
  category?: Category;
}
export class GetListQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = 15;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  page?: number = 1;
}
