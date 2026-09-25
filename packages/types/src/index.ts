export type UserRole = 'admin' | 'buyer' | 'supplier' | 'agent';
export type RequestCategory = 'mining' | 'hinge' | 'trade';
export type RequestStatus = 'open' | 'closed';
export type MatchStatus = 'pending' | 'accepted' | 'rejected';
export type ProjectStatus = 'draft' | 'negotiating' | 'executing' | 'closed';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  trust_score: number;
}

export interface CreateRequestPayload {
  title: string;
  description: string;
  category: RequestCategory;
  budget_min: number;
  budget_max: number;
  country_target: string;
}

export interface MatchResponse {
  request_id: string;
  matches: Array<{
    supplier_id: string;
    score: number;
  }>;
}
