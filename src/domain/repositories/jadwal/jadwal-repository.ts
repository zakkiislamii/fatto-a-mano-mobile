import { JadwalKaryawan } from "@/src/common/types/jadwal-karyawan";
import { db } from "@/src/configs/firebase-config";
import { Unsubscribe } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

export class JadwalRepository {
  private readonly uid: string;
  private jam_masuk: string = "";
  private jam_keluar: string = "";
  private hari_kerja: string = "";
  private is_wfh: boolean = false;

  public constructor(uid: string) {
    this.uid = uid;
  }

  public setJamMasuk(jam_keluar: string): void {
    this.jam_masuk = jam_keluar.trim();
  }

  public setJamKeluar(jam_keluar: string): void {
    this.jam_keluar = jam_keluar.trim();
  }

  public setHariKerja(hari_kerja: string): void {
    this.hari_kerja = hari_kerja.trim();
  }

  public setIsWfh(is_wfh: boolean): void {
    this.is_wfh = is_wfh;
  }

  public getUid(): string {
    return this.uid;
  }

  public getJamMasuk(): string {
    return this.jam_masuk;
  }

  public getJamKeluar(): string {
    return this.jam_keluar;
  }

  public getHariKerja(): string {
    return this.hari_kerja;
  }

  public getIsWfh(): boolean {
    return this.is_wfh;
  }

  public getJadwalKaryawanRealTime(
    cb: (jadwal: JadwalKaryawan | null) => void
  ): Unsubscribe | null {
    try {
      if (!this.uid) return null;

      return onSnapshot(
        doc(db, "users", this.uid),
        (snap) => {
          if (!snap.exists()) {
            cb(null);
            return;
          }

          const data = snap.data() as Record<string, any>;
          const j = data.jadwal;

          if (!j) {
            cb(null);
            return;
          }

          this.setJamMasuk(j.jam_masuk ?? "");
          this.setJamKeluar(j.jam_keluar ?? "");
          this.setHariKerja(j.hari_kerja ?? "");
          this.setIsWfh(!!j.is_wfh);

          cb({
            jam_masuk: this.jam_masuk,
            jam_keluar: this.jam_keluar,
            hari_kerja: this.hari_kerja,
            is_wfh: this.is_wfh,
          });
        },
        () => cb(null)
      );
    } catch (error: unknown) {
      console.error(error);
      throw error;
    }
  }
}
