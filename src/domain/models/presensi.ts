import { StatusPresensi } from "@/src/common/enums/status-presensi";

export interface Presensi {
  uid: string;
  tanggal: string;
  status: StatusPresensi;
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
