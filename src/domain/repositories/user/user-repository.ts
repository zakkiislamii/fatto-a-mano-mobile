import { JadwalKaryawan } from "@/src/common/types/jadwal-karyawan";
import { ProfilKaryawan } from "@/src/common/types/profil-karyawan";
import { db } from "@/src/configs/firebase-config";
import {
  Timestamp,
  Unsubscribe,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { ExcelService } from "../../services/excel-service";

export class UserRepository {
  private readonly uid: string;
  private nama: string = "";
  private nik: string = "";
  private nomor_hp: string = "";
  private divisi: string = "";
  private jadwal: JadwalKaryawan | null = null;

  public constructor(uid: string) {
    this.uid = uid;
  }

  public setJadwal(jadwal: JadwalKaryawan): void {
    this.jadwal = jadwal;
  }

  public setNama(nama: string): void {
    this.nama = nama?.trim() ?? "";
  }

  public setNik(nik: string): void {
    this.nik = nik?.trim() ?? "";
  }

  public setNomorHp(nomor: string): void {
    this.nomor_hp = nomor?.trim() ?? "";
  }

  public setDivisi(divisi: string): void {
    this.divisi = divisi?.trim() ?? "";
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

  public getDivisi(): string {
    return this.divisi;
  }

  public getJadwal(): JadwalKaryawan | null {
    return this.jadwal;
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
        () => cb(null)
      );
    } catch (error: unknown) {
      console.error(error);
      throw error;
    }
  }

  public async editProfil(): Promise<void> {
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

  public async updateLengkapiProfil(): Promise<void> {
    try {
      if (!this.uid) throw new Error("UID tidak valid.");

      const dataToWrite = {
        updated_at: Timestamp.now(),
        nama: this.nama?.trim() || undefined,
        nik: this.nik?.trim() || undefined,
        nomor_hp: this.nomor_hp?.trim() || undefined,
        divisi: this.divisi?.trim() || undefined,
        jadwal: this.jadwal || undefined,
      };

      Object.keys(dataToWrite).forEach((key) => {
        if ((dataToWrite as any)[key] === undefined) {
          delete (dataToWrite as any)[key];
        }
      });

      const ref = doc(db, "users", this.uid);
      await setDoc(ref, dataToWrite, { merge: true });

      const snapshot = await getDoc(ref);
      if (!snapshot.exists())
        throw new Error("User tidak ditemukan di Firestore.");
      const userData = snapshot.data();

      const excel = new ExcelService(this.uid);
      excel.setEmail(userData.email ?? "");
      excel.setNama(userData.nama ?? "");
      excel.setNik(userData.nik ?? "");
      excel.setNomorHp(userData.nomor_hp ?? "");
      excel.setDivisi(userData.divisi ?? "");

      if (userData.jadwal) {
        excel.setHariKerja(userData.jadwal.hari_kerja ?? "");
        excel.setJamMasuk(userData.jadwal.jam_masuk ?? "");
        excel.setJamKeluar(userData.jadwal.jam_keluar ?? "");
        excel.setIsWfh(!!userData.jadwal.is_wfh);
      }

      await excel.addRow();
    } catch (err) {
      console.error("[UserRepository] updateLengkapiProfil error:", err);
      throw err;
    }
  }

  public getLengkapiProfilRealTime(
    cb: (isComplete: boolean) => void
  ): Unsubscribe | null {
    try {
      if (!this.uid) return null;
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
        doc(db, "users", this.uid),
        (snap) => {
          if (!snap.exists()) {
            cb(false);
            return;
          }
          const data = snap.data() as Partial<{
            nama?: string;
            nik?: string;
            nomor_hp?: string;
            divisi?: string;
            jadwal?: JadwalKaryawan;
          }>;

          // 🔍 Debug log untuk melihat data jadwal
          console.log("📋 Validating jadwal:", data.jadwal);

          const namaOk = isNonEmptyString(data.nama);
          const nikOk = isNonEmptyString(data.nik);
          const nomorOk = isNonEmptyString(data.nomor_hp);
          const divisiOk = isNonEmptyString(data.divisi);
          const jadwalOk = isJadwalValid(data.jadwal);

          // 🔍 Debug log untuk setiap field
          console.log("✅ Validation:", {
            namaOk,
            nikOk,
            nomorOk,
            divisiOk,
            jadwalOk,
          });

          const isComplete = namaOk && nikOk && nomorOk && divisiOk && jadwalOk;
          cb(isComplete);
        },
        () => cb(false)
      );
    } catch (err) {
      console.error("[UserRepository] getProfilCompleteRealTime error:", err);
      cb(false);
      return null;
    }
  }
}
