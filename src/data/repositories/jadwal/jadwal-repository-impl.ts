import { JadwalKaryawan } from "@/src/common/types/jadwal-karyawan";
import { db } from "@/src/configs/firebase-config";
import { IJadwalRepository } from "@/src/domain/repositories/jadwal/i-jadwal-repository";
import { Unsubscribe } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

export class JadwalRepositoryImpl implements IJadwalRepository {
  public getJadwalKaryawanRealTime(
    uid: string,
    cb: (jadwal: JadwalKaryawan | null) => void
  ): Unsubscribe | null {
    try {
      if (!uid) {
        console.warn("[JadwalRepository] UID tidak diberikan.");
        return null;
      }

      return onSnapshot(
        doc(db, "users", uid),
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

          const jadwalKaryawan: JadwalKaryawan = {
            jam_masuk: j.jam_masuk ?? "",
            jam_keluar: j.jam_keluar ?? "",
            hari_kerja: j.hari_kerja ?? "",
            is_wfh: !!j.is_wfh,
          };

          cb(jadwalKaryawan);
        },
        (error) => {
          console.error("[JadwalRepository] onSnapshot error:", error);
          cb(null);
        }
      );
    } catch (error: unknown) {
      console.error("[JadwalRepository] Get Jadwal RealTime error:", error);
      throw error;
    }
  }
}
