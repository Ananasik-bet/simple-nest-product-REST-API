import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  UsePipes,
  ValidationPipe,
  Put,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto, UserDtoSwagger } from './dto/user.dto';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(200)
  @Auth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: [UserDtoSwagger],
  })
  @ApiResponse({
    status: 403,
    description: 'Access Denied: Insufficient permissions',
  })
  findAll(@CurrentUser('role') role: Role) {
    if (role !== Role.ADMIN)
      throw new ForbiddenException('Access Denied: Insufficient permissions');

    return this.usersService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  @Auth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: UserDtoSwagger,
  })
  @ApiResponse({
    status: 403,
    description: 'Access Denied: Insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: Role,
  ) {
    if (userId !== id && role !== Role.ADMIN)
      throw new ForbiddenException('Access Denied: Insufficient permissions');

    return this.usersService.getById(id);
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(201)
  @Auth()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserDtoSwagger,
  })
  @ApiResponse({
    status: 403,
    description: 'Access Denied: Insufficient permissions',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@CurrentUser('role') role: Role, @Body() dto: AuthDto) {
    if (role !== Role.ADMIN)
      throw new ForbiddenException('Access Denied: Insufficient permissions');

    return this.usersService.create(dto);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth()
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserDtoSwagger,
  })
  @ApiResponse({
    status: 403,
    description: 'Access Denied: Insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: Role,
    @Body() dto: UserDto,
  ) {
    if (userId !== id && role !== Role.ADMIN)
      throw new ForbiddenException('Access Denied: Insufficient permissions');
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @Auth()
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({
    status: 403,
    description: 'Access Denied: Insufficient permissions',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  remove(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: Role,
  ) {
    if (userId !== id && role !== Role.ADMIN)
      throw new ForbiddenException('Access Denied: Insufficient permissions');

    const user = this.usersService.getById(id);

    if (!user) throw new BadRequestException('User does not exist');

    return this.usersService.remove(id);
  }
}
