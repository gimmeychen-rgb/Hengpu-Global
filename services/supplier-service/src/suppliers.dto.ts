import { IsArray, IsBoolean, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @MaxLength(160)
  company_name!: string;

  @IsString()
  @MaxLength(80)
  country!: string;

  @IsArray()
  @IsIn(['mining', 'hinge', 'trade'], { each: true })
  product_categories!: string[];

  @IsOptional()
  @IsBoolean()
  verified?: boolean;
}
