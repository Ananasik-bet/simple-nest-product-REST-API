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

  create(userId: string, dto: CreateProductDto) {
    const data = {
      ...dto,
      userId,
    };

    return this.prisma.product.create({
      data,
    });
  }

  getList(options: GetListQueryDto) {
    const extraSearch: any = {};

    if (options.name) {
      extraSearch.name = {
        contains: options.name,
        mode: 'insensitive',
      };
    }

    if (options.price) {
      extraSearch.price = options.price;
    }

    if (options.currency) {
      extraSearch.currency = options.currency;
    }

    if (options.category) {
      extraSearch.category = options.category;
    }

    return this.prisma.product.findMany({
      where: { ...extraSearch },
      orderBy: {
        createdAt: 'desc',
      },
      take: options.limit,
      skip: (options.page - 1) * options.limit,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
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
