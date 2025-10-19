import { PresensiKeluar } from "@/src/common/types/presensi-keluar";
import { db } from "@/src/configs/firebaseConfig";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { PresensiRepository } from "../contracts/presensi-contracts";

export class PresensiKeluarRepository extends PresensiRepository {
  private presensi_keluar: PresensiKeluar | null = null;

  public setPresensiKeluar(data: PresensiKeluar) {
    this.presensi_keluar = data;
  }

  public getPresensiKeluar() {
    return this.presensi_keluar;
  }

  public async add(): Promise<void> {
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
      console.error("Error adding presensi keluar:", error);
      throw error;
    }
  }
}
