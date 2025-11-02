import { StatusPresensi } from "@/src/common/enums/status-presensi";
import { PresensiKeluar } from "@/src/domain/models/presensi-keluar";
import { PresensiMasuk } from "@/src/domain/models/presensi-masuk";
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
