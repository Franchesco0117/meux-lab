import {
  Post,
  Body,
  Get,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { CookieOptions, Response } from 'express';
import { AuthService } from '../../application/services/auth.service.js';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error.js';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '../../domain/interfaces/user-repository.interface.js';
import {
  CookieAuthGuard,
  type AuthenticatedRequest,
} from '../../guards/cookie-auth.guard.js';
import { UserResponseDto } from '../dtos/user-response.dto.js';
import { RegisterDto } from '../dtos/register.dto.js';

interface LoginBodyDto {
  email: string;
  password: string;
}

const AUTH_COOKIE_NAME = 'access_token';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  @Post('register')
  @HttpCode(201)
  @ApiCreatedResponse({ type: UserResponseDto })
  async register(@Body() dto: RegisterDto): Promise<UserResponseDto> {
    const userDomainEntity = await this.auth.register(dto);

    return {
      id: userDomainEntity.id,
      name: userDomainEntity.name,
      email: userDomainEntity.email.value,
      createdAt: userDomainEntity.createdAt,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Inicio de sesión exitoso; cookie httpOnly establecida.',
  })
  async login(
    @Body() body: LoginBodyDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const result = await this.auth.login({
        email: body.email,
        password: body.password,
      });

      const isProd = process.env.NODE_ENV === 'production';
      const cookieOptions: CookieOptions = {
        httpOnly: true,
        sameSite: 'lax',
        secure: isProd,
        path: '/',
        maxAge: 15 * 60 * 1000,
      };

      res.cookie(AUTH_COOKIE_NAME, result.accessToken, cookieOptions);

      return {
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email.value,
        },
      };
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw new UnauthorizedException('Correo o contraseña inválidos.');
      }
      throw error;
    }
  }

  @Get('me')
  @UseGuards(CookieAuthGuard)
  @ApiOkResponse({ description: 'Sesión activa verificada.' })
  async me(@Req() req: AuthenticatedRequest) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Sesión no válida o expirada.');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Sesión no válida o expirada.');
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email.value,
      },
    };
  }
}
