import { JadwalKaryawan } from "@/src/common/types/jadwal-karyawan";
import { db } from "@/src/configs/firebase-config";
import { Unsubscribe } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

export class JadwalRepository {
  private readonly uid: string;
  private jamMasuk: string = "";
  private jamKeluar: string = "";
  private hariKerja: string = "";
  private isWfh: boolean = false;

  public constructor(uid: string) {
    this.uid = uid;
  }

  public setJamMasuk(value: string): void {
    this.jamMasuk = value.trim();
  }

  public setJamKeluar(value: string): void {
    this.jamKeluar = value.trim();
  }

  public setHariKerja(value: string): void {
    this.hariKerja = value.trim();
  }

  public setIsWfh(value: boolean): void {
    this.isWfh = value;
  }

  public getUid(): string {
    return this.uid;
  }

  public getJamMasuk(): string {
    return this.jamMasuk;
  }

  public getJamKeluar(): string {
    return this.jamKeluar;
  }

  public getHariKerja(): string {
    return this.hariKerja;
  }

  public getIsWfh(): boolean {
    return this.isWfh;
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
          this.setHariKerja(j.hariKerja ?? "");
          this.setIsWfh(!!j.isWfh);

          cb({
            jam_masuk: this.jamMasuk,
            jam_keluar: this.jamKeluar,
            hariKerja: this.hariKerja,
            isWfh: this.isWfh,
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
