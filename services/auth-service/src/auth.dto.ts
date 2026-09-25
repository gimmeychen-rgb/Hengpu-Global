import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

const roles = ['admin', 'buyer', 'supplier', 'agent'] as const;

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(128)
  password!: string;

  @IsIn(roles)
  role!: 'admin' | 'buyer' | 'supplier' | 'agent';

  @IsOptional()
  @IsString()
  @MaxLength(160)
  company_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  country?: string;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}
