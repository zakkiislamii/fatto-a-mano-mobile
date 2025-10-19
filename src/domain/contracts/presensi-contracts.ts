import { StatusPresensi } from "@/src/common/enums/status-presensi";

export abstract class PresensiRepository {
  protected readonly uid: string;
  protected tanggal: string;
  protected status: StatusPresensi | null = null;

  public constructor(uid: string, tanggal: string) {
    this.uid = uid;
    this.tanggal = tanggal;
  }

  abstract add(): Promise<void>;

  public setStatus(status: StatusPresensi) {
    this.status = status;
  }

  public getStatus() {
    return this.status;
  }
}
