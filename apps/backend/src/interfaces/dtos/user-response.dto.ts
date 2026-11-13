import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 'c56a4180-65aa-42ec-a945-5fd21dec0538' })
  id!: string;

  @ApiProperty({ example: 'User' })
  name!: string;

  @ApiProperty({ example: 'user@mail.com' })
  email!: string;

  @ApiProperty({ example: '2026-11-11T16:00:00.000Z' })
  createdAt!: Date;
}
