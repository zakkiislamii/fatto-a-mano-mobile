import { JadwalKaryawan } from "./jadwal-karyawan";

export interface LengkapiProfil {
  nama: string;
  divisi: string;
  nomor_hp: string;
  jadwal: JadwalKaryawan;
}
