import { JadwalKaryawan } from "@/src/common/types/jadwal-karyawan";
import { db } from "@/src/configs/firebaseConfig";
import { Unsubscribe } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

export class JadwalRepository {
  private readonly uid: string;

  public constructor(uid: string) {
    this.uid = uid;
  }

  public getJadwalKaryawanRealTime(
    cb: (jadwal: JadwalKaryawan | null) => void
  ): Unsubscribe | null {
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

        const mapped: JadwalKaryawan = {
          jam_masuk: j.jam_masuk ?? "",
          jam_keluar: j.jam_keluar ?? "",
          hariKerja: j.hariKerja ?? "",
          isWfh: !!j.isWfh,
        };

        cb(mapped);
      },
      (_err) => cb(null)
    );
  }
}
