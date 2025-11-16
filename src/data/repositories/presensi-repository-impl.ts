import { StatusPresensi } from "@/src/common/enums/status-presensi";
import { PresensiKeluarStatus } from "@/src/common/types/presensi-keluar-status";
import { PresensiMasukStatus } from "@/src/common/types/presensi-masuk-status";
import Today from "@/src/common/utils/get-today";
import { db } from "@/src/configs/firebase-config";
import { PresensiKeluar } from "@/src/domain/models/presensi-keluar";
import { PresensiMasuk } from "@/src/domain/models/presensi-masuk";
import { IPresensiRepository } from "@/src/domain/repositories/i-presensi-repository";
import {
  doc,
  onSnapshot,
  setDoc,
  Timestamp,
  Unsubscribe,
  updateDoc,
} from "firebase/firestore";

export class PresensiRepositoryImpl implements IPresensiRepository {
  public async addPresensiMasuk(
    uid: string,
    tanggal: string,
    status: StatusPresensi,
    data: PresensiMasuk
  ): Promise<void> {
    try {
      if (!uid || !tanggal || !status || !data) {
        throw new Error("Data presensi masuk tidak lengkap.");
      }

      await setDoc(
        doc(db, "presensi", tanggal, "users", uid),
        {
          presensi_masuk: data,
          status: status,
          uid: uid,
          tanggal: tanggal,
          created_at: Timestamp.now(),
          updated_at: Timestamp.now(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("[PresensiRepository] Error adding presensi masuk:", error);
      throw error;
    }
  }

  public async addPresensiKeluar(
    uid: string,
    tanggal: string,
    data: PresensiKeluar
  ): Promise<void> {
    try {
      if (!uid || !tanggal || !data) {
        throw new Error("Data presensi keluar tidak lengkap.");
      }

      await updateDoc(doc(db, "presensi", tanggal, "users", uid), {
        presensi_keluar: data,
        updated_at: Timestamp.now(),
      });
    } catch (error) {
      console.error(
        "[PresensiRepository] Error adding presensi keluar:",
        error
      );
      throw error;
    }
  }

  public getPresensiMasukToday(
    uid: string,
    cb: (status: PresensiMasukStatus) => void
  ): Unsubscribe | null {
    try {
      if (!uid) {
        cb({
          sudah_masuk: false,
          status: null,
          terlambat: false,
          durasi_terlambat: null,
        });
        return null;
      }

      const tanggal = Today();
      const docRef = doc(db, "presensi", tanggal, "users", uid);

      const unsubscribe = onSnapshot(
        docRef,
        (docSnapshot) => {
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
        },
        (error) => {
          console.error(
            "[PresensiRepository] getPresensiMasukToday onSnapshot error:",
            error
          );
          cb({
            sudah_masuk: false,
            status: null,
            terlambat: false,
            durasi_terlambat: null,
          });
        }
      );
      return unsubscribe;
    } catch (error) {
      console.error("[PresensiRepository] getPresensiMasukToday error:", error);
      throw error;
    }
  }

  public getPresensiKeluarToday(
    uid: string,
    cb: (status: PresensiKeluarStatus) => void
  ): Unsubscribe | null {
    try {
      if (!uid) {
        cb({ sudah_keluar: false, lembur: false });
        return null;
      }

      const tanggal = Today();
      const docRef = doc(db, "presensi", tanggal, "users", uid);

      const unsubscribe = onSnapshot(
        docRef,
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
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
        },
        (error) => {
          console.error(
            "[PresensiRepository] getPresensiKeluarToday onSnapshot error:",
            error
          );
          cb({
            sudah_keluar: false,
            lembur: false,
          });
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error(
        "[PresensiRepository] getPresensiKeluarToday error:",
        error
      );
      throw error;
    }
  }

  public async addAutoPresensiChecker(
    uid: string,
    tanggal: string,
    status: StatusPresensi
  ): Promise<void> {
    try {
      if (!uid || !tanggal || !status) {
        throw new Error("Data presensi masuk tidak lengkap.");
      }

      await setDoc(
        doc(db, "presensi", tanggal, "users", uid),
        {
          status: status,
          uid: uid,
          tanggal: tanggal,
          created_at: Timestamp.now(),
          updated_at: Timestamp.now(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("[PresensiRepository] Error adding presensi masuk:", error);
      throw error;
    }
  }
}
