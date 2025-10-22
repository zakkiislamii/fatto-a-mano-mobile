import { PresensiKeluar } from "@/src/common/types/presensi-keluar";
import { PresensiKeluarStatus } from "@/src/common/types/presensi-keluar-status";
import Today from "@/src/common/utils/get-today";
import { db } from "@/src/configs/firebaseConfig";
import { Unsubscribe } from "firebase/auth";
import { doc, onSnapshot, Timestamp, updateDoc } from "firebase/firestore";
import { PresensiRepository } from "../abstracts/presensi-abstract";

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

  public getPresensiKeluarToday(
    cb: (status: PresensiKeluarStatus) => void
  ): Unsubscribe {
    try {
      const tanggal = Today();
      const docRef = doc(db, "presensi", tanggal, "users", this.uid);
      const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          cb({
            sudah_keluar: !!data.presensi_keluar,
          });
        } else {
          cb({
            sudah_keluar: false,
          });
        }
      });
      return unsubscribe;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
