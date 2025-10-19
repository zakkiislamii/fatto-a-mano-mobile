import { ProfilKaryawan } from "@/src/common/types/profil-karyawan";
import { db } from "@/src/configs/firebaseConfig";
import {
  Timestamp,
  Unsubscribe,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

export class UserRepository {
  private readonly uid: string;
  private nama: string;
  private nik: string;
  private nomor_hp: string;

  public constructor(uid: string) {
    this.uid = uid;
    this.nama = "";
    this.nik = "";
    this.nomor_hp = "";
  }

  public setNama(nama: string) {
    this.nama = nama?.trim() ?? "";
  }

  public setNik(nik: string) {
    this.nik = nik?.trim() ?? "";
  }

  public setNomorHp(nomor: string) {
    this.nomor_hp = nomor?.trim() ?? "";
  }

  public getUid(): string {
    return this.uid;
  }

  public getNama(): string {
    return this.nama;
  }

  public getNik(): string {
    return this.nik;
  }

  public getNomorHp(): string {
    return this.nomor_hp;
  }

  public getProfilRealTime(
    cb: (data: ProfilKaryawan | null) => void
  ): Unsubscribe | null {
    try {
      if (!this.uid) return null;

      return onSnapshot(
        doc(db, "users", this.uid),
        (snap) => {
          if (!snap.exists()) {
            this.setNama("");
            this.setNik("");
            this.setNomorHp("");
            cb(null);
            return;
          }

          const data = snap.data() as ProfilKaryawan;
          this.setNama((data.nama ?? "").toString());
          this.setNik((data.nik ?? "").toString());
          this.setNomorHp((data.nomor_hp ?? "").toString());
          cb(data);
        },
        () => {
          cb(null);
        }
      );
    } catch (error: unknown) {
      console.error(error);
      throw error;
    }
  }

  public async updateProfil(): Promise<void> {
    try {
      if (!this.uid) throw new Error("UID tidak valid.");

      const dataToWrite = {
        updated_at: Timestamp.now(),
        nama: this.nama?.trim() || undefined,
        nik: this.nik?.trim() || undefined,
        nomor_hp: this.nomor_hp?.trim() || undefined,
      } as ProfilKaryawan;

      Object.keys(dataToWrite).forEach((key) => {
        if ((dataToWrite as any)[key] === undefined) {
          delete (dataToWrite as any)[key];
        }
      });

      if (Object.keys(dataToWrite).length === 1) {
        throw new Error("Tidak ada data untuk diperbarui.");
      }

      const ref = doc(db, "users", this.uid);
      await setDoc(ref, dataToWrite, { merge: true });
    } catch (error: unknown) {
      console.error(error);
      throw error;
    }
  }
}
