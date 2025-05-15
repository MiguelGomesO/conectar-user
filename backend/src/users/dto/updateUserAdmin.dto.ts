import { IsOptional, IsEnum, IsString, isString } from 'class-validator';

export class UpdateUserAdminDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  role?: string;


  @IsOptional()
  @IsString()
  avatar?: string;
}
