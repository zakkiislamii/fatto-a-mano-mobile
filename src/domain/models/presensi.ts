import { StatusPresensi } from "@/src/common/enums/status-presensi";
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

export interface PresensiMasuk extends Presensi {
  waktu: string;
  terlambat: boolean;
  durasi_terlambat?: string;
}

export interface PresensiKeluar extends Presensi {
  waktu: string;
  lembur: boolean;
  durasi_lembur?: string;
}
