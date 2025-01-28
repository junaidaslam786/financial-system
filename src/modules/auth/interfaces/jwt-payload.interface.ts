export interface JwtPayload {
  sub?: string; // Subject (user ID)
  id?: string;
  email: string;
  role?: string;
  companyId?: string;
}
