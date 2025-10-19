import { StatusPresensi } from "../enums/status-presensi";

export interface PresensiMasukStatus {
  sudah_masuk: boolean;
  status: StatusPresensi | null;
  terlambat: boolean;
  durasi_terlambat: string | null;
}
