import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  Equals,
  IsBoolean,
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

const trim = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class RegisterDto {
  @ApiProperty({ example: 'User' })
  @Transform(trim)
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'user@mail.com' })
  @Transform(trim)
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 8, example: 'SuperSecurePassword123' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;

  @ApiProperty({
    example: true,
    description: 'You must acccept the terms and conditions',
  })
  @IsBoolean()
  @Equals(true, {
    message: 'You must acccept the terms and conditions to continue',
  })
  termsAccepted!: boolean;
}
