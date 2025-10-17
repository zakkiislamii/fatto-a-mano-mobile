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
          presensi_masuk: data.jadwal?.presensi_masuk ?? "",
          presensi_keluar: data.jadwal?.presensi_masuk ?? "",
          hariKerja: data.jadwal?.hariKerja ?? "",
          isWfh: data.jadwal?.isWfh ?? false,
        },
        nik: (data.nik as string) ?? "",
        nomor_hp: (data.nomor_hp as string) ?? "",
      });
    });
  }
}
