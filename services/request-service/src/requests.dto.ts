import { IsIn, IsNotEmpty, IsNumber, IsString, MaxLength, Min } from 'class-validator';

export class CreateRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  description!: string;

  @IsIn(['mining', 'hinge', 'trade'])
  category!: 'mining' | 'hinge' | 'trade';

  @IsNumber()
  @Min(0)
  budget_min!: number;

  @IsNumber()
  @Min(0)
  budget_max!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  country_target!: string;
}
