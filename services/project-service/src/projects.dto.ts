import { IsIn, IsOptional, IsUUID } from 'class-validator';

export class CreateProjectDto {
  @IsUUID()
  request_id!: string;

  @IsUUID()
  buyer_id!: string;

  @IsUUID()
  supplier_id!: string;
}

export class UpdateProjectStatusDto {
  @IsIn(['draft', 'negotiating', 'executing', 'closed'])
  status!: 'draft' | 'negotiating' | 'executing' | 'closed';

  @IsOptional()
  @IsIn(['success', 'failed', 'none'])
  outcome?: 'success' | 'failed' | 'none';
}
