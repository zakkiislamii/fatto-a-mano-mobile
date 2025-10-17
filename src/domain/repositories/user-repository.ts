import { db } from "@/src/configs/firebaseConfig";
import { Unsubscribe } from "firebase/auth";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";

export class UserRepository {
  private readonly uid: string;

  public constructor(uid: string) {
    this.uid = uid;
  }

  public getProfilRealTime(
    cb: (data: Record<string, any> | null) => void
  ): Unsubscribe | null {
    if (!this.uid) return null;

    return onSnapshot(
      doc(db, "users", this.uid),
      (snap) => {
        if (!snap.exists()) {
          cb(null);
          return;
        }
        cb(snap.data() as Record<string, any>);
      },
      (_err) => cb(null)
    );
  }

  public async updateProfil(
    nama?: string,
    nik?: string,
    nomor_hp?: string
  ): Promise<void> {
    if (!this.uid) throw new Error("UID tidak valid.");

    const data: Record<string, any> = {
      updatedAt: serverTimestamp(),
    };

    if (nama !== undefined && nama.trim() !== "") {
      data.nama = nama.trim();
    }
    if (nik !== undefined && nik !== "") {
      data.nik = nik.trim();
    }
    if (nomor_hp !== undefined && nomor_hp.trim() !== "") {
      data.nomor_hp = nomor_hp.trim();
    }

    if (Object.keys(data).length === 1) {
      throw new Error("Tidak ada data untuk diperbarui.");
    }

    const ref = doc(db, "users", this.uid);
    await setDoc(ref, data, { merge: true });
  }
}
