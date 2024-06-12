import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Role } from '@prisma/client';
import { ForbiddenException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    findAll: jest.fn().mockResolvedValue([]),
    getById: jest.fn().mockRejectedValue(null),
    create: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockResolvedValue(null),
    remove: jest.fn().mockResolvedValue(null),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call service findAll if role is ADMIN', async () => {
      const role = Role.ADMIN;
      await controller.findAll(role);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if role is not ADMIN', () => {
      const role = Role.USER;
      expect(() => controller.findAll(role)).toThrow(ForbiddenException);
    });
  });

  describe('findOne', () => {
    it("should throw ForbiddenException if user is requesting another user's data and is not ADMIN", () => {
      const id = 'other-user-id';
      const role = Role.USER;
      const userId = 'user-id';

      expect(() => controller.findOne(id, userId, role)).toThrow(
        ForbiddenException,
      );
    });
  });

  describe('create', () => {
    it('should call service create if role is ADMIN', async () => {
      const role = Role.ADMIN;
      const dto = { email: 'test@test.com', password: 'password' };

      await controller.create(role, dto);
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should throw ForbiddenException if role is not ADMIN', () => {
      const role = Role.USER;
      const dto = { email: 'test@test.com', password: 'password' };

      expect(() => controller.create(role, dto)).toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should call service update if user is ADMIN', async () => {
      const id = 'some-id';
      const role = Role.ADMIN;
      const userId = 'admin-id';
      const dto = { email: 'test@test.com', password: 'password' };

      await controller.update(id, userId, role, dto);
      expect(service.update).toHaveBeenCalledWith(id, dto);
    });

    it('should call service update if user is updating own data', async () => {
      const id = 'user-id';
      const role = Role.USER;
      const userId = 'user-id';
      const dto = { email: 'test@test.com', password: 'password' };

      await controller.update(id, userId, role, dto);
      expect(service.update).toHaveBeenCalledWith(id, dto);
    });

    it("should throw ForbiddenException if user is updating another user's data and is not ADMIN", () => {
      const id = 'other-user-id';
      const role = Role.USER;
      const userId = 'user-id';
      const dto = { email: 'test@test.com', password: 'password' };

      expect(() => controller.update(id, userId, role, dto)).toThrow(
        ForbiddenException,
      );
    });
  });

  describe('remove', () => {
    it('should call service remove if user is ADMIN', async () => {
      mockUsersService.getById.mockResolvedValue({ id: 'some-id' });

      await controller.remove('some-id', 'admin-id', Role.ADMIN);
      expect(service.remove).toHaveBeenCalledWith('some-id');
    });
  });
});
