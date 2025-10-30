export interface INotifikasiService {
  RegisterToken(uid: string): Promise<boolean>;
  DeleteToken(uid: string): Promise<boolean>;
}
