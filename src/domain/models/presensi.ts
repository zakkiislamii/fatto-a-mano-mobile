import { StatusPresensi } from "@/src/common/enums/status-presensi";
import { PresensiKeluar } from "@/src/common/types/presensi-keluar";
import { PresensiMasuk } from "@/src/common/types/presensi-masuk";
import { Timestamp } from "firebase/firestore";

export interface Presensi {
  uid: string;
  tanggal: string;
  status: StatusPresensi;
  presensi_masuk: PresensiMasuk;
  presensi_keluar: PresensiKeluar;
  created_at: Timestamp;
  updated_at: Timestamp;
}
