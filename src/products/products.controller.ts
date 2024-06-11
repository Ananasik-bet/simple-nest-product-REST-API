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
  UnauthorizedException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import {
  CreateProductDto,
  GetListQueryDto,
  ProductSwaggerDto,
  UpdateProductDto,
} from './dto/product.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { Role } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(201)
  @Auth()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created',
    type: ProductSwaggerDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorize',
  })
  @ApiResponse({
    status: 403,
    description: 'Access Denied: Insufficient permissions',
  })
  @ApiBearerAuth()
  async create(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: Role,
    @Body() dto: CreateProductDto,
  ) {
    if (role !== Role.ADMIN)
      throw new ForbiddenException('Access Denied: Insufficient permissions');

    return this.productsService.create(userId, dto);
  }

  @Get()
  @HttpCode(200)
  @Auth()
  @ApiOperation({ summary: 'Get a list of products' })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Limit the number of products to retrieve',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Specify the page number for paginated results',
  })
  @ApiResponse({
    status: 200,
    description: 'List of products retrieved successfully',
    type: [ProductSwaggerDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorize',
  })
  @ApiBearerAuth()
  async getList(@Query() options: GetListQueryDto) {
    return this.productsService.getList(options);
  }

  @Get(':id')
  @HttpCode(200)
  @Auth()
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    type: ProductSwaggerDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Product does not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorize',
  })
  @ApiBearerAuth()
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.getById(id);

    if (!product) throw new BadRequestException('Product not found');

    return product;
  }

  @Put(':id')
  @HttpCode(200)
  @Auth()
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: ProductSwaggerDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorize',
  })
  @ApiResponse({
    status: 403,
    description: 'Access Denied: Insufficient permissions',
  })
  @ApiBearerAuth()
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
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiResponse({
    status: 204,
    description: 'Product deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Product does not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorize',
  })
  @ApiBearerAuth()
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
