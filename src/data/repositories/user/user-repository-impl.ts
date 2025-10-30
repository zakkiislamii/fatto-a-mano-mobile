import { JadwalKaryawan } from "@/src/common/types/jadwal-karyawan";
import { ProfilKaryawan } from "@/src/common/types/profil-karyawan";
import {
  EditProfilData,
  LengkapiProfilData,
} from "@/src/common/types/user-data";
import { db } from "@/src/configs/firebase-config";
import { IUserRepository } from "@/src/domain/repositories/user/i-user-repository";
import {
  DocumentData,
  Timestamp,
  Unsubscribe,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

export class UserRepositoryImpl implements IUserRepository {
  public getProfilRealTime(
    uid: string,
    cb: (data: ProfilKaryawan | null) => void
  ): Unsubscribe | null {
    try {
      if (!uid) return null;

      return onSnapshot(
        doc(db, "users", uid),
        (snap) => {
          if (!snap.exists()) {
            cb(null);
            return;
          }
          cb(snap.data() as ProfilKaryawan);
        },
        (error) => {
          console.error("[UserRepository] getProfilRealTime error:", error);
          cb(null);
        }
      );
    } catch (error: unknown) {
      console.error("[UserRepository] getProfilRealTime error:", error);
      throw error;
    }
  }

  public async editProfil(uid: string, data: EditProfilData): Promise<void> {
    try {
      if (!uid) throw new Error("UID tidak valid.");

      const dataToWrite: DocumentData = {
        ...data,
        updated_at: Timestamp.now(),
      };

      // Hapus field undefined agar tidak menimpa data yang ada
      Object.keys(dataToWrite).forEach((key) => {
        if (dataToWrite[key] === undefined) {
          delete dataToWrite[key];
        }
      });

      if (Object.keys(dataToWrite).length <= 1) {
        throw new Error("Tidak ada data untuk diperbarui.");
      }

      const ref = doc(db, "users", uid);
      await setDoc(ref, dataToWrite, { merge: true });
    } catch (error: unknown) {
      console.error("[UserRepository] editProfil error:", error);
      throw error;
    }
  }

  public async updateLengkapiProfil(
    uid: string,
    data: LengkapiProfilData
  ): Promise<void> {
    try {
      if (!uid) throw new Error("UID tidak valid.");

      const dataToWrite: DocumentData = {
        ...data,
        updated_at: Timestamp.now(),
      };

      Object.keys(dataToWrite).forEach((key) => {
        if (dataToWrite[key] === undefined) {
          delete dataToWrite[key];
        }
      });

      const ref = doc(db, "users", uid);
      await setDoc(ref, dataToWrite, { merge: true });
    } catch (err) {
      console.error("[UserRepository] updateLengkapiProfil error:", err);
      throw err;
    }
  }

  public getLengkapiProfilRealTime(
    uid: string,
    cb: (isComplete: boolean) => void
  ): Unsubscribe | null {
    try {
      if (!uid) return null;

      const isNonEmptyString = (v: unknown): v is string =>
        typeof v === "string" && v.trim().length > 0;

      const isJadwalValid = (j: any): j is JadwalKaryawan => {
        if (!j || typeof j !== "object") return false;
        if (!isNonEmptyString(j.jam_masuk)) return false;
        if (!isNonEmptyString(j.jam_keluar)) return false;
        if (!isNonEmptyString(j.hari_kerja)) return false;
        if (typeof j.is_wfh !== "boolean") return false;
        return true;
      };

      return onSnapshot(
        doc(db, "users", uid),
        (snap) => {
          if (!snap.exists()) {
            cb(false);
            return;
          }
          const data = snap.data() as Partial<LengkapiProfilData>;

          const namaOk = isNonEmptyString(data.nama);
          const nikOk = isNonEmptyString(data.nik);
          const nomorOk = isNonEmptyString(data.nomor_hp);
          const divisiOk = isNonEmptyString(data.divisi);
          const jadwalOk = isJadwalValid(data.jadwal);

          const isComplete = namaOk && nikOk && nomorOk && divisiOk && jadwalOk;
          cb(isComplete);
        },
        (error: unknown) => {
          console.error(
            "[UserRepository] getLengkapiProfilRealTime error:",
            error
          );
          cb(false);
        }
      );
    } catch (err) {
      console.error("[UserRepository] getLengkapiProfilRealTime error:", err);
      cb(false);
      return null;
    }
  }
}
