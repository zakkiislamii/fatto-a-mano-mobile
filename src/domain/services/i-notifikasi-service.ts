export interface INotifikasiService {
  RegisterToken(uid: string): Promise<boolean>;
  DeleteToken(uid: string): Promise<boolean>;
  SendToKaryawan(uid: string): Promise<boolean>;
  SendToAll(): Promise<boolean>;
}
