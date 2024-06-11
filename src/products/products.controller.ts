import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  BadRequestException,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import {
  CreateProductDto,
  GetListQueryDto,
  UpdateProductDto,
} from './dto/product.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { Role } from '@prisma/client';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(201)
  @Auth()
  async create(@CurrentUser('role') role: Role, @Body() dto: CreateProductDto) {
    if (role !== Role.ADMIN)
      throw new ForbiddenException('Access Denied: Insufficient permissions');

    return this.productsService.create(dto);
  }

  @Get()
  @HttpCode(200)
  @Auth()
  async getList(@Query() options: GetListQueryDto) {
    return this.productsService.getList(options);
  }

  @Get(':id')
  @HttpCode(200)
  @Auth()
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.getById(id);

    if (!product) throw new BadRequestException('Product not found');

    return product;
  }

  @Put(':id')
  @HttpCode(200)
  @Auth()
  async update(
    @Param('id') id: string,
    @CurrentUser('role') role: Role,
    @Body() dto: UpdateProductDto,
  ) {
    if (role !== Role.ADMIN)
      throw new ForbiddenException('Access Denied: Insufficient permissions');

    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @Auth()
  async remove(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: Role,
  ) {
    const product = await this.productsService.getById(id);

    if (!product) throw new BadRequestException('Product not found');

    if (userId !== product.id && role !== Role.ADMIN)
      throw new ForbiddenException('Access Denied: Insufficient permissions');

    return this.productsService.remove(id);
  }
}
