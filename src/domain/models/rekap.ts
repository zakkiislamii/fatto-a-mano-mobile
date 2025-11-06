import { JadwalKaryawan } from "./jadwal-karyawan";
import { Presensi } from "./presensi";

export interface RekapKaryawan {
  uid: string;
  email: string;
  nama: string;
  divisi: string;
  jadwal: JadwalKaryawan;
  presensi_list: Presensi[];
}
