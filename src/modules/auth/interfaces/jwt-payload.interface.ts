export interface JwtPayload {
  sub?: string; // Subject (user ID)
  id?: string;
  email: string;
  role?: string;
  roleId?: string;
  companyId?: string;
}
