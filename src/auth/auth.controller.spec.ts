import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Response, Request } from 'express';
import { Role } from '@prisma/client';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    getNewTokens: jest.fn(),
    removeRefreshToken: jest.fn(),
    addRefreshTokenToResponse: jest.fn(),
  };

  const mockResponse = {
    cookie: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should login a user', async () => {
      const dto: AuthDto = { email: 'test@example.com', password: 'password' };
      const result = {
        user: {
          id: 'userId',
          email: 'test@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Test User',
          role: Role.USER,
        },
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };

      jest.spyOn(authService, 'login').mockResolvedValue(result);

      expect(await authController.login(dto, mockResponse)).toEqual({
        user: result.user,
        accessToken: result.accessToken,
      });
      expect(authService.addRefreshTokenToResponse).toHaveBeenCalledWith(
        mockResponse,
        result.refreshToken,
      );
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const dto: AuthDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new UnauthorizedException());

      await expect(authController.login(dto, mockResponse)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    it('should register a user', async () => {
      const dto: AuthDto = { email: 'test@example.com', password: 'password' };
      const result = {
        user: {
          id: 'userId',
          email: 'test@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Test User',
          role: Role.USER,
        },
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };

      jest.spyOn(authService, 'register').mockResolvedValue(result);

      expect(await authController.register(dto, mockResponse)).toEqual({
        user: result.user,
        accessToken: result.accessToken,
      });
      expect(authService.addRefreshTokenToResponse).toHaveBeenCalledWith(
        mockResponse,
        result.refreshToken,
      );
    });

    it('should throw BadRequestException for existing user', async () => {
      const dto: AuthDto = { email: 'test@example.com', password: 'password' };
      jest
        .spyOn(authService, 'register')
        .mockRejectedValue(new BadRequestException());

      await expect(authController.register(dto, mockResponse)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getNewTokens', () => {
    it('should throw UnauthorizedException if refresh token is not passed', async () => {
      const req = {
        cookies: {},
      } as unknown as Request;

      await expect(
        authController.getNewTokens(req, mockResponse),
      ).rejects.toThrow(UnauthorizedException);
      expect(authService.removeRefreshToken).toHaveBeenCalledWith(mockResponse);
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      const req = {
        cookies: { refreshToken: 'invalidRefreshToken' },
      } as unknown as Request;

      jest
        .spyOn(authService, 'getNewTokens')
        .mockRejectedValue(new UnauthorizedException());

      await expect(
        authController.getNewTokens(req, mockResponse),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should logout a user', async () => {
      expect(await authController.logout(mockResponse)).toBe(true);
      expect(authService.removeRefreshToken).toHaveBeenCalledWith(mockResponse);
    });
  });
});
