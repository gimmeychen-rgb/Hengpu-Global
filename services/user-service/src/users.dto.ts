import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsIn(['admin', 'buyer', 'supplier', 'agent'])
  role?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(200)
  trust_score?: number;
}
