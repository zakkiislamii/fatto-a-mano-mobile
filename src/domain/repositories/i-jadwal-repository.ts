import { JadwalKaryawan } from "@/src/common/types/jadwal-karyawan";
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
    data: Array<{ uid: string; jadwal: JadwalKaryawan; excelId: number }>
  ): Promise<void>;
}
