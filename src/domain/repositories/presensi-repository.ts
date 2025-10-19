import { StatusPresensi } from "@/src/common/enums/status-presensi";
import { db } from "@/src/configs/firebaseConfig";
import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { PresensiKeluar, PresensiMasuk } from "../models/presensi";

export class PresensiRepository {
  private readonly uid: string;
  private readonly tanggal: string;
  private readonly status: StatusPresensi;
  private readonly presensi_masuk: PresensiMasuk;
  private readonly presensi_keluar: PresensiKeluar;

  public constructor(
    uid: string,
    tanggal: string,
    status: StatusPresensi,
    presensi_masuk: PresensiMasuk,
    presensi_keluar: PresensiKeluar
  ) {
    this.uid = uid;
    this.tanggal = tanggal;
    this.status = status;
    this.presensi_masuk = presensi_masuk;
    this.presensi_keluar = presensi_keluar;
  }

  public async addPresensiMasuk(): Promise<void> {
    const id = `${this.uid}_${this.tanggal}`;
    const ref = doc(db, "presensi", id);

    await setDoc(
      ref,
      {
        presensi_masuk: this.presensi_masuk,
        status: this.status,
        uid: this.uid,
        tanggal: this.tanggal,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      },
      { merge: true }
    );
  }

  public async addPresensiKeluar(): Promise<void> {
    const id = `${this.uid}_${this.tanggal}`;
    const ref = doc(db, "presensi", id);

    await updateDoc(ref, {
      presensi_keluar: this.presensi_keluar,
      updated_at: serverTimestamp(),
    });
  }
}
