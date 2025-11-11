import { JadwalKaryawan } from "@/src/domain/models/jadwal-karyawan";
import { Unsubscribe } from "firebase/auth";

export interface IJadwalRepository {
  getJadwalKaryawanRealTime(
    uid: string,
    cb: (jadwal: JadwalKaryawan | null) => void
  ): Unsubscribe | null;

  editJadwalKaryawan(
    uid: string,
    jadwal: Partial<JadwalKaryawan>
  ): Promise<void>;

  sinkronJadwal(
    data: { uid: string; jadwal: JadwalKaryawan; sheetyId: number }[]
  ): Promise<void>;

  sinkronJadwalFromSheets(): Promise<number>;
}
