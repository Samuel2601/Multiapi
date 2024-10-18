import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsArray, IsInt } from 'class-validator';

export class CreateRoleUserDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true }) // Cambiado a IsInt para manejar IDs numéricos
  readonly permisos?: number[]; // Cambiado a number para IDs de permisos

  @IsOptional()
  @IsBoolean()
  readonly is_default?: boolean; // Se puede definir si es rol por defecto o no
}

export class UpdateRoleUserDto {
  @IsNotEmpty() // Asegurarse que este campo esté presente
  @IsInt()
  readonly id: number; // Cambiado a number para ID

  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true }) // Cambiado a IsInt para manejar IDs numéricos
  readonly permisos?: number[]; // Cambiado a number para IDs de permisos

  @IsOptional()
  @IsBoolean()
  readonly is_default?: boolean; // Actualización opcional de rol por defecto
}
