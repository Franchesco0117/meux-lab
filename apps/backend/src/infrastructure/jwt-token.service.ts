import { Inject, Injectable } from '@nestjs/common';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import { InvalidCredentialsError } from '../domain/errors/invalid-credentials.error.js';
import type {
  AccessTokenPayload,
  ITokenService,
} from '../domain/interfaces/token.service.interface.js';

export const JWT_TOKEN_OPTIONS = Symbol('JWT_TOKEN_OPTIONS');

export interface JwtTokenServiceOptions {
  secret: string;
  expiresIn?: JwtSignOptions['expiresIn'];
}

@Injectable()
export class JwtTokenService implements ITokenService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(JWT_TOKEN_OPTIONS)
    private readonly options: JwtTokenServiceOptions,
  ) {}

  async signAccessToken(payload: AccessTokenPayload): Promise<string> {
    return this.jwtService.signAsync(
      { sub: payload.sub, email: payload.email },
      {
        secret: this.options.secret,
        expiresIn: this.options.expiresIn ?? '15m',
      },
    );
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    try {
      const decoded = await this.jwtService.verifyAsync<AccessTokenPayload>(
        token,
        {
          secret: this.options.secret,
        },
      );

      if (!decoded?.sub || !decoded?.email) {
        throw new InvalidCredentialsError();
      }

      return {
        sub: decoded.sub,
        email: decoded.email,
      };
    } catch {
      throw new InvalidCredentialsError();
    }
  }
}
