import { JadwalKaryawan } from "./jadwal-karyawan";

export interface ProfilKaryawan {
  uid: string;
  email: string;
  nomor_hp: string;
  nik: string;
  nama: string;
  divisi: string;
  jadwal: JadwalKaryawan;
}
