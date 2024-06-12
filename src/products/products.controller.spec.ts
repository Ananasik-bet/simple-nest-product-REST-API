import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Category, Currency, Role } from '@prisma/client';
import { ForbiddenException, BadRequestException } from '@nestjs/common';
import { CreateProductDto } from './dto/product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    create: jest.fn().mockResolvedValue(null),
    getList: jest.fn().mockResolvedValue([]),
    getById: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockResolvedValue(null),
    remove: jest.fn().mockResolvedValue(null),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service create if role is ADMIN', async () => {
      const role = Role.ADMIN;
      const dto: CreateProductDto = {
        name: 'Product',
        price: 10,
        currency: Currency.EUR,
        category: Category.FASHION,
      };
      const userId = 'user-id';

      await controller.create(userId, role, dto);
      expect(service.create).toHaveBeenCalledWith(userId, dto);
    });

    it('should throw ForbiddenException if role is not ADMIN', async () => {
      const role = Role.USER;
      const dto: CreateProductDto = {
        name: 'Product',
        price: 10,
        currency: Currency.EUR,
        category: Category.FASHION,
      };
      const userId = 'user-id';

      await expect(() => controller.create(userId, role, dto)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('getList', () => {
    it('should call service getList', async () => {
      const options = { limit: 10, page: 1 };

      await controller.getList(options);
      expect(service.getList).toHaveBeenCalledWith(options);
    });
  });

  describe('findOne', () => {
    it('should call service getById and return product if found', async () => {
      const id = 'product-id';
      const mockProduct = {
        id: 'product-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Product',
        description: 'Product description',
        price: 10,
        currency: Currency.USD,
        category: Category.ELECTRONICS,
        userId: 'user-id',
      };

      jest.spyOn(service, 'getById').mockResolvedValueOnce(mockProduct);

      const result = await controller.findOne(id);
      expect(service.getById).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockProduct);
    });

    it('should throw BadRequestException if product not found', async () => {
      const id = 'non-existent-id';
      jest.spyOn(service, 'getById').mockResolvedValueOnce(null);

      await expect(controller.findOne(id)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should throw ForbiddenException if role is not ADMIN', async () => {
      const id = 'product-id';
      const role = Role.USER;
      const dto = { name: 'Updated Product', price: 15 };

      await expect(() => controller.update(id, role, dto)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('remove', () => {
    it('should throw BadRequestException if product is not found', async () => {
      const id = 'product-id';
      const role = Role.USER;
      const userId = 'user-id';

      await expect(controller.remove(id, userId, role)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
