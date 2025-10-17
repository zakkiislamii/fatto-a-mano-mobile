import { User } from "@/src/domain/models/user";
import { UserRepository } from "@/src/domain/repositories/user-repository";
import { Unsubscribe } from "firebase/auth";

export class UserViewModel {
  private readonly uid: string;
  private readonly repo: UserRepository;

  public constructor(uid: string) {
    this.uid = uid;
    this.repo = new UserRepository(uid);
  }

  public getUserDataProfileRealtime(
    cb: (user: User | null) => void
  ): Unsubscribe | null {
    if (!this.uid) return null;

    return this.repo.getProfilRealTime((data) => {
      if (!data) {
        cb(null);
        return;
      }
      cb({
        uid: this.uid,
        email: (data.email as string) ?? "",
        role: data.role!,
        nama: (data.nama as string) ?? "",
        divisi: (data.divisi as string) ?? "",
        jadwal: {
          jam_masuk: data.jadwal?.jam_masuk ?? "",
          jam_keluar: data.jadwal?.jam_keluar ?? "",
          hariKerja: data.jadwal?.hariKerja ?? "",
          isWfh: data.jadwal?.isWfh ?? false,
        },
        nik: (data.nik as string) ?? "",
        nomor_hp: (data.nomor_hp as string) ?? "",
      });
    });
  }

  public async updateProfil(data: {
    nama?: string;
    nik?: string;
    nomor_hp?: string;
  }): Promise<void> {
    if (!this.uid) throw new Error("UID tidak tersedia.");

    const payload: Record<string, string> = {};

    if (data.nama !== undefined && data.nama.trim() !== "") {
      payload.nama = data.nama.trim();
    }

    if (data.nik !== undefined && data.nik !== "") {
      payload.nik = data.nik;
    }

    if (data.nomor_hp !== undefined && data.nomor_hp.trim() !== "") {
      payload.nomor_hp = data.nomor_hp.trim();
    }

    if (Object.keys(payload).length === 0) {
      throw new Error("Tidak ada data untuk diperbarui.");
    }

    await this.repo.updateProfil(
      payload.nama || undefined,
      payload.nik || undefined,
      payload.nomor_hp || undefined
    );
  }
}
