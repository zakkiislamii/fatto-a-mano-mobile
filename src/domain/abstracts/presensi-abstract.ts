import { StatusPresensi } from "@/src/common/enums/status-presensi";

export abstract class PresensiRepository {
  protected readonly uid: string;
  protected tanggal: string;
  protected status: StatusPresensi | null = null;

  public constructor(uid: string, tanggal: string) {
    this.uid = uid;
    this.tanggal = tanggal;
  }

  public setStatus(status: StatusPresensi): void {
    this.status = status;
  }

  public getStatus(): StatusPresensi | null {
    return this.status;
  }

  abstract add(): Promise<void>;
}
