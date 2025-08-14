export interface CreateUserQueryParams {
  loginAfterCreate?: boolean;
}

export interface IQuery {
  role?: string;
  isAffiliate?: boolean;
  isActive?: boolean;
  status?: string;
  search?: string;
  type?: string;
  page?: number;
  limit?: number;
}
