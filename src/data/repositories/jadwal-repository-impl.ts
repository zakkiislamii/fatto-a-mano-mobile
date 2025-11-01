import { JadwalKaryawan } from "@/src/common/types/jadwal-karyawan";
import { db } from "@/src/configs/firebase-config";
import { IJadwalRepository } from "@/src/domain/repositories/i-jadwal-repository";
import { Unsubscribe } from "firebase/auth";
import { doc, onSnapshot, updateDoc, writeBatch } from "firebase/firestore";

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
            is_wfa: !!j.is_wfa,
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

  public async editJadwalKaryawan(
    uid: string,
    jadwal: Partial<JadwalKaryawan>
  ): Promise<void> {
    try {
      if (!uid) {
        throw new Error("UID tidak diberikan.");
      }

      const updateData: Record<string, any> = {};

      if (jadwal.jam_masuk !== undefined) {
        updateData["jadwal.jam_masuk"] = jadwal.jam_masuk;
      }
      if (jadwal.jam_keluar !== undefined) {
        updateData["jadwal.jam_keluar"] = jadwal.jam_keluar;
      }
      if (jadwal.hari_kerja !== undefined) {
        updateData["jadwal.hari_kerja"] = jadwal.hari_kerja;
      }
      if (jadwal.is_wfa !== undefined) {
        updateData["jadwal.is_wfa"] = jadwal.is_wfa;
      }

      updateData["updated_at"] = new Date();

      if (Object.keys(updateData).length === 1) {
        throw new Error("Tidak ada perubahan data jadwal.");
      }

      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, updateData);
    } catch (error: unknown) {
      console.error("[JadwalRepository] Update Jadwal error:", error);
      throw error;
    }
  }

  public async sinkronJadwal(
    data: Array<{ uid: string; jadwal: JadwalKaryawan; excelId: number }>
  ): Promise<void> {
    try {
      const batch = writeBatch(db);

      data.forEach(({ uid, jadwal, excelId }) => {
        const userRef = doc(db, "users", uid);
        batch.update(userRef, {
          "jadwal.jam_masuk": jadwal.jam_masuk,
          "jadwal.jam_keluar": jadwal.jam_keluar,
          "jadwal.hari_kerja": jadwal.hari_kerja,
          "jadwal.is_wfa": jadwal.is_wfa,
          excel_id: excelId,
          updated_at: new Date(),
        });
      });

      await batch.commit();
      console.log(
        `[SinkronRepository] Bulk sinkron berhasil untuk ${data.length} user`
      );
    } catch (error) {
      console.error("[SinkronRepository] Bulk sinkron error:", error);
      throw error;
    }
  }
}
