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
import { UserDto } from './dto/user.dto';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  @HttpCode(200)
  @Auth()
  findAll(@CurrentUser('role') role: Role) {
    if (role !== Role.ADMIN)
      throw new ForbiddenException('Access Denied: Insufficient permissions');

    return this.usersService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  @Auth()
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
  create(@CurrentUser('role') role: Role, @Body() dto: AuthDto) {
    if (role !== Role.ADMIN)
      throw new ForbiddenException('Access Denied: Insufficient permissions');

    return this.usersService.create(dto);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth()
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
  remove(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: Role,
  ) {
    if (userId !== id && role !== Role.ADMIN)
      throw new ForbiddenException('Access Denied: Insufficient permissions');

    const user = this.usersService.getById(id);

    if (!user) throw new BadRequestException('User does not exists');

    return this.usersService.remove(id);
  }
}
