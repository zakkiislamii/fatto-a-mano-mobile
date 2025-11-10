import { UserRole } from "@/src/common/enums/user-role";
import {
  EditProfilData,
  LengkapiProfilData,
} from "@/src/common/types/user-data";
import { db } from "@/src/configs/firebase-config";
import { JadwalKaryawan } from "@/src/domain/models/jadwal-karyawan";
import { Karyawan } from "@/src/domain/models/karyawan";
import { ProfilKaryawan } from "@/src/domain/models/profil-karyawan";
import { IUserRepository } from "@/src/domain/repositories/i-user-repository";
import {
  DocumentData,
  Timestamp,
  Unsubscribe,
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
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
        if (typeof j.is_wfa !== "boolean") return false;
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
          const divisiOk = isNonEmptyString(data.divisi);
          const jadwalOk = isJadwalValid(data.jadwal);

          const isComplete = namaOk && divisiOk && jadwalOk;
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

  public getAllKaryawanRealTime(
    cb: (data: Karyawan[] | null) => void
  ): Unsubscribe | null {
    try {
      const q = query(
        collection(db, "users"),
        where("role", "==", UserRole.KARYAWAN)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const karyawanList: Karyawan[] = snapshot.docs.map((doc) => ({
            ...(doc.data() as Karyawan),
            uid: doc.id,
          }));
          cb(karyawanList);
        },
        (error) => {
          console.error("[KaryawanRepository] Error fetching karyawan:", error);
          cb(null);
        }
      );

      return unsubscribe;
    } catch (err) {
      console.error("[KaryawanRepository] getAllKaryawanRealTime error:", err);
      return null;
    }
  }
}
