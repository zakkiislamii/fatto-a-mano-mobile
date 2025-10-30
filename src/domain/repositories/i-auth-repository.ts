export interface IAuthRepository {
  register(email: string, password: string): Promise<void>;
  login(email: string, password: string): Promise<void>;
  loginWithGoogle(): Promise<void>;
  logout(): Promise<void>;
}
