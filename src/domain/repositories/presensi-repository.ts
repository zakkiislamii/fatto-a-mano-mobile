import { StatusPresensi } from "@/src/common/enums/status-presensi";
import { PresensiKeluar } from "@/src/common/types/presensi-keluar";
import { PresensiMasuk } from "@/src/common/types/presensi-masuk";
import { db } from "@/src/configs/firebaseConfig";
import { doc, setDoc, Timestamp, updateDoc } from "firebase/firestore";

export class PresensiRepository {
  private readonly uid: string;
  private tanggal: string;
  private status: StatusPresensi;
  private presensi_masuk: PresensiMasuk | null;
  private presensi_keluar: PresensiKeluar | null;

  public constructor(uid: string, tanggal: string, status: StatusPresensi) {
    this.uid = uid;
    this.tanggal = tanggal;
    this.status = status;
    this.presensi_masuk = null;
    this.presensi_keluar = null;
  }

  public setPresensiMasuk(data: PresensiMasuk): void {
    this.presensi_masuk = data;
  }

  public getPresensiMasuk(): PresensiMasuk | null {
    return this.presensi_masuk;
  }

  public setPresensiKeluar(data: PresensiKeluar): void {
    this.presensi_keluar = data;
  }

  public getPresensiKeluar(): PresensiKeluar | null {
    return this.presensi_keluar;
  }

  public async addPresensiMasuk(): Promise<void> {
    try {
      if (!this.presensi_masuk) {
        throw new Error("Data presensi masuk belum diatur.");
      }

      const ref = doc(db, "presensi", this.tanggal, "users", this.uid);

      await setDoc(
        ref,
        {
          presensi_masuk: this.presensi_masuk,
          status: this.status,
          uid: this.uid,
          tanggal: this.tanggal,
          created_at: Timestamp.now(),
          updated_at: Timestamp.now(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async addPresensiKeluar(): Promise<void> {
    try {
      if (!this.presensi_keluar) {
        throw new Error("Data presensi keluar belum diatur.");
      }

      const ref = doc(db, "presensi", this.tanggal, "users", this.uid);

      await updateDoc(ref, {
        presensi_keluar: this.presensi_keluar,
        updated_at: Timestamp.now(),
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
