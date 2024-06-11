import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiCookieAuth,
  ApiConsumes,
  ApiHeader,
} from '@nestjs/swagger';
import {
  Controller,
  Post,
  HttpCode,
  Req,
  Res,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, AuthSwaggerDto } from './dto/auth.dto';
import { Request, Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: AuthSwaggerDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: AuthDto })
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...response } = await this.authService.login(dto);
    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(201)
  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: AuthSwaggerDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: AuthDto })
  async register(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } = await this.authService.register(dto);
    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  @HttpCode(200)
  @Post('login/access-token')
  @ApiOperation({
    summary: 'Get new access tokens',
    description:
      'Requires refresh token cookie. Make sure to include the refresh token received from the login endpoint in the request cookies.',
  })
  @ApiResponse({
    status: 200,
    description: 'Tokens successfully refreshed',
    type: AuthSwaggerDto,
  })
  @ApiResponse({ status: 401, description: 'Refresh token not passed' })
  @ApiHeader({
    name: 'Cookie',
    description: 'Refresh token cookie',
    example: 'refreshToken=<your-refresh-token>',
  })
  async getNewTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshTokenFromCookie =
      req.cookies[this.authService.REFRESH_TOKEN_NAME];

    if (!refreshTokenFromCookie) {
      this.authService.removeRefreshToken(res);
      throw new UnauthorizedException('Refresh token not passed');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { refreshToken, ...response } = await this.authService.getNewTokens(
      refreshTokenFromCookie,
    );

    return response;
  }

  @HttpCode(200)
  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
  async logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshToken(res);

    return true;
  }
}
