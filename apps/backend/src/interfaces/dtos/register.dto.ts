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
  @IsString({ message: 'El nombre debe ser un texto válido' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede superar los 100 caracteres' })
  name!: string;

  @ApiProperty({ example: 'user@mail.com' })
  @Transform(trim)
  @IsEmail({}, { message: 'Ingresa un correo electrónico válido' })
  email!: string;

  @ApiProperty({ minLength: 8, example: 'SuperSecurePassword123' })
  @IsString({ message: 'La contraseña debe ser un texto válido' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(128, {
    message: 'La contraseña no puede superar los 128 caracteres',
  })
  password!: string;

  @ApiProperty({
    example: true,
    description: 'Debes aceptar los términos y condiciones',
  })
  @IsBoolean({ message: 'Debes indicar si aceptas los términos y condiciones' })
  @Equals(true, {
    message: 'Debes aceptar los términos y condiciones para continuar',
  })
  termsAccepted!: boolean;
}
