import { PresensiMasuk } from "@/src/common/types/presensi-masuk";
import { PresensiMasukStatus } from "@/src/common/types/presensi-masuk-status";
import { db } from "@/src/configs/firebaseConfig";
import { Unsubscribe } from "firebase/auth";
import { doc, onSnapshot, setDoc, Timestamp } from "firebase/firestore";
import { PresensiRepository } from "../contracts/presensi-contracts";

export class PresensiMasukRepository extends PresensiRepository {
  private presensi_masuk: PresensiMasuk | null = null;

  public setPresensiMasuk(data: PresensiMasuk): void {
    this.presensi_masuk = data;
  }

  public getPresensiMasuk(): PresensiMasuk | null {
    return this.presensi_masuk;
  }

  public async add(): Promise<void> {
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
      console.error("Error adding presensi masuk:", error);
      throw error;
    }
  }

  public getPresensiMasukToday(
    cb: (status: PresensiMasukStatus) => void
  ): Unsubscribe {
    try {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const tanggal = `${yyyy}-${mm}-${dd}`;
      const docRef = doc(db, "presensi", tanggal, "users", this.uid);

      const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          cb({
            sudah_masuk: !!data.presensi_masuk,
            status: data.status || null,
            terlambat: data.presensi_masuk?.terlambat || false,
            durasi_terlambat: data.presensi_masuk?.durasi_terlambat || null,
          });
        } else {
          cb({
            sudah_masuk: false,
            status: null,
            terlambat: false,
            durasi_terlambat: null,
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
