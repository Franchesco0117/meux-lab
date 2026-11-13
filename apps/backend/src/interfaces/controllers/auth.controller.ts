import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../../application/services/auth.service.js';
import { UserResponseDto } from '../dtos/user-response.dto.js';
import { Post, Body, Controller, HttpCode } from '@nestjs/common';
import { RegisterDto } from '../dtos/register.dto.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

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
}
