import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

const trimAndLower = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

export class LoginDto {
  @ApiProperty({ example: 'user@mail.com' })
  @Transform(trimAndLower)
  @IsString({ message: 'El correo electrónico debe ser un texto válido' })
  @IsNotEmpty({ message: 'Ingresa tu correo electrónico' })
  @IsEmail({}, { message: 'Ingresa un correo electrónico válido' })
  email!: string;

  @ApiProperty({ example: 'SuperSecurePassword123' })
  @IsString({ message: 'La contraseña debe ser un texto válido' })
  @IsNotEmpty({ message: 'Ingresa tu contraseña' })
  @MaxLength(128, {
    message: 'La contraseña no puede superar los 128 caracteres',
  })
  password!: string;
}
