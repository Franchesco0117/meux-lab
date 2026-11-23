export interface AccessTokenPayload {
  sub: string;
  email: string;
}

export interface ITokenService {
  signAccessToken(payload: AccessTokenPayload): Promise<string> | string;
  verifyAccessToken(
    token: string,
  ): Promise<AccessTokenPayload> | AccessTokenPayload;
}

export const TOKEN_SERVICE = Symbol('ITokenService');
