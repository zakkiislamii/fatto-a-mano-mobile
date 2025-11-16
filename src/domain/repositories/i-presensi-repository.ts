import { StatusPresensi } from "@/src/common/enums/status-presensi";
import { PresensiKeluarStatus } from "@/src/common/types/presensi-keluar-status";
import { PresensiMasukStatus } from "@/src/common/types/presensi-masuk-status";
import { PresensiKeluar } from "@/src/domain/models/presensi-keluar";
import { PresensiMasuk } from "@/src/domain/models/presensi-masuk";
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

  addAutoPresensiChecker(
    uid: string,
    tanggal: string,
    status: StatusPresensi
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
