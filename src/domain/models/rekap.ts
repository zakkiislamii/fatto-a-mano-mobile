import { JadwalKaryawan } from "./jadwal-karyawan";
import { Presensi } from "./presensi";

export interface RekapKaryawan {
  uid: string;
  email: string;
  nomor_hp: string;
  nama: string;
  divisi: string;
  jadwal: JadwalKaryawan;
  presensi_list: Presensi[];
}

export interface RekapRow {
  nama: string;
  divisi: string;
  tanggal: string;
  status: string;
  jam_masuk: string;
  terlambat: string;
  durasi_terlambat: string;
  jam_keluar: string;
  lembur: string;
  durasi_lembur: string;
  keluar_awal: string;
  alasan_keluar_awal: string;
  bukti_keluar_awal: string;
}
