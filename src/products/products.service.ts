import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  CreateProductDto,
  GetListQueryDto,
  UpdateProductDto,
} from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: dto,
    });
  }

  getList(options: GetListQueryDto) {
    return this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: options.limit,
      skip: (options.page - 1) * options.limit,
    });
  }

  update(id: string, dto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
}
