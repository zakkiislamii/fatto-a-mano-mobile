import { db } from "@/src/configs/firebase-config";
import { SheetyServiceImpl } from "@/src/data/data-sources/sheety-service-impl";
import { JadwalKaryawan } from "@/src/domain/models/jadwal-karyawan";
import { IJadwalRepository } from "@/src/domain/repositories/i-jadwal-repository";
import { ISheetyService } from "@/src/domain/services/i-sheety-service";
import { Unsubscribe } from "firebase/auth";
import { doc, onSnapshot, updateDoc, writeBatch } from "firebase/firestore";

export class JadwalRepositoryImpl implements IJadwalRepository {
  private sheetyService: ISheetyService;

  constructor() {
    this.sheetyService = new SheetyServiceImpl();
  }

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
    data: { uid: string; jadwal: JadwalKaryawan; sheetyId: number }[]
  ): Promise<void> {
    try {
      if (!data || data.length === 0) {
        throw new Error("Tidak ada data untuk disinkronkan.");
      }

      const batch = writeBatch(db);

      data.forEach(({ uid, jadwal, sheetyId }) => {
        const userRef = doc(db, "users", uid);
        batch.update(userRef, {
          "jadwal.jam_masuk": jadwal.jam_masuk,
          "jadwal.jam_keluar": jadwal.jam_keluar,
          "jadwal.hari_kerja": jadwal.hari_kerja,
          "jadwal.is_wfa": jadwal.is_wfa,
          sheety_id: sheetyId,
          updated_at: new Date(),
        });
      });

      await batch.commit();
    } catch (error) {
      console.error("[JadwalRepository] Bulk sinkron error:", error);
      throw error;
    }
  }

  public async sinkronJadwalFromSheets(): Promise<number> {
    try {
      const freshData = await this.sheetyService.getRows();

      if (!freshData || freshData.length === 0) {
        return 0;
      }

      // 2. Transform data
      const sinkronData = freshData
        .filter((row) => row.id !== undefined && row.uid)
        .map((row) => ({
          uid: row.uid,
          jadwal: {
            jam_masuk: row.jamMasuk || "",
            jam_keluar: row.jamKeluar || "",
            hari_kerja: row.hariKerja || "",
            is_wfa: row.isWfa || false,
          } as JadwalKaryawan,
          sheetyId: row.id as number,
        }));

      if (sinkronData.length === 0) {
        return 0;
      }

      await this.sinkronJadwal(sinkronData);
      return sinkronData.length;
    } catch (error) {
      console.error("[JadwalRepository] sinkronJadwalFromExcel error:", error);
      throw error;
    }
  }

  public getJadwalWithSheetyIdRealTime(
    uid: string,
    cb: (data: {
      jadwal: JadwalKaryawan | null;
      sheetyId: number | null;
    }) => void
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
            cb({ jadwal: null, sheetyId: null });
            return;
          }

          const data = snap.data() as Record<string, any>;
          const j = data.jadwal;
          const sheetyId = data.sheety_id ?? null;

          if (!j) {
            cb({ jadwal: null, sheetyId });
            return;
          }

          const jadwalKaryawan: JadwalKaryawan = {
            jam_masuk: j.jam_masuk ?? "",
            jam_keluar: j.jam_keluar ?? "",
            hari_kerja: j.hari_kerja ?? "",
            is_wfa: !!j.is_wfa,
          };

          cb({ jadwal: jadwalKaryawan, sheetyId });
        },
        (error) => {
          console.error("[JadwalRepository] onSnapshot error:", error);
          cb({ jadwal: null, sheetyId: null });
        }
      );
    } catch (error: unknown) {
      console.error(
        "[JadwalRepository] getJadwalWithSheetyIdRealTime error:",
        error
      );
      throw error;
    }
  }
}
