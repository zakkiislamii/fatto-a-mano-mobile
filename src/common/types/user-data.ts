import { JadwalKaryawan } from "@/src/domain/models/jadwal-karyawan";

export interface EditProfilData {
  nama?: string;
}

export interface LengkapiProfilData {
  nama?: string;
  divisi?: string;
  jadwal?: JadwalKaryawan;
  sheety_id?: number;
}
