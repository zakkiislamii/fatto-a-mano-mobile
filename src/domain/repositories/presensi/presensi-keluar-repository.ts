import { PresensiKeluar } from "@/src/common/types/presensi-keluar";
import { PresensiKeluarStatus } from "@/src/common/types/presensi-keluar-status";
import Today from "@/src/common/utils/get-today";
import { db } from "@/src/configs/firebase-config";
import type { Unsubscribe } from "firebase/firestore";
import { doc, onSnapshot, Timestamp, updateDoc } from "firebase/firestore";
import { PresensiRepository } from "../../abstracts/presensi-abstract";

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
      await updateDoc(doc(db, "presensi", this.tanggal, "users", this.uid), {
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

      if (!this.uid) {
        cb({ sudah_keluar: false, lembur: false });
        return () => {};
      }

      const docRef = doc(db, "presensi", tanggal, "users", this.uid);

      const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as Record<string, any> | undefined;
          const presensiKeluar = data?.presensi_keluar ?? null;

          cb({
            sudah_keluar: !!presensiKeluar,
            lembur: !!presensiKeluar?.lembur,
          });
        } else {
          cb({
            sudah_keluar: false,
            lembur: false,
          });
        }
      });

      return unsubscribe;
    } catch (error) {
      console.error("getPresensiKeluarToday error:", error);
      throw error;
    }
  }
}
