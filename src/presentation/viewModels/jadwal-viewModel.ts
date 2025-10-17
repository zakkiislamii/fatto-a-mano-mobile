import { JadwalKaryawan } from "@/src/domain/models/jadwal-karyawan";
import { JadwalRepository } from "@/src/domain/repositories/jadwal-repository";
import { Unsubscribe } from "firebase/auth";

export class JadwalViewModel {
  private readonly uid: string;
  private readonly repo: JadwalRepository;

  public constructor(uid: string) {
    this.uid = uid;
    this.repo = new JadwalRepository(uid);
  }

  public getJadwalKaryawanRealtime(
    cb: (jadwal: JadwalKaryawan | null) => void
  ): Unsubscribe | null {
    if (!this.uid) return null;

    return this.repo.getJadwalKaryawanRealTime((data) => {
      if (!data || !data.jadwal) {
        cb(null);
        return;
      }
      const j = data.jadwal;
      cb({
        jam_masuk: j.jam_masuk ?? "",
        jam_keluar: j.jam_keluar ?? "",
        hariKerja: j.hariKerja ?? "",
        isWfh: j.isWfh ?? false,
      });
    });
  }
}
