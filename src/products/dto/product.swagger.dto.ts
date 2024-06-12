import { Category, Currency } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

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
