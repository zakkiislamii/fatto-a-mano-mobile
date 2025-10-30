import { Timestamp } from "firebase/firestore";
import { JadwalKaryawan } from "./jadwal-karyawan";

export interface ProfilKaryawan {
  email: string;
  nomor_hp: string;
  nik: string;
  nama: string;
  jadwal?: JadwalKaryawan;
  divisi: string;
  updated_at: Timestamp;
}
