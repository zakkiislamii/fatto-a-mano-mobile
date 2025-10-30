import { StatusPresensi } from "@/src/common/enums/status-presensi";
import { PresensiKeluar } from "@/src/common/types/presensi-keluar";
import { PresensiKeluarStatus } from "@/src/common/types/presensi-keluar-status";
import { PresensiMasuk } from "@/src/common/types/presensi-masuk";
import { PresensiMasukStatus } from "@/src/common/types/presensi-masuk-status";
import { Unsubscribe } from "firebase/firestore";

export interface IPresensiRepository {
  addPresensiMasuk(
    uid: string,
    tanggal: string,
    status: StatusPresensi,
    data: PresensiMasuk
  ): Promise<void>;

  addPresensiKeluar(
    uid: string,
    tanggal: string,
    data: PresensiKeluar
  ): Promise<void>;

  getPresensiMasukToday(
    uid: string,
    cb: (status: PresensiMasukStatus) => void
  ): Unsubscribe | null;

  getPresensiKeluarToday(
    uid: string,
    cb: (status: PresensiKeluarStatus) => void
  ): Unsubscribe | null;
}
