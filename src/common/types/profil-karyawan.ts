import { Timestamp } from "firebase/firestore";

export interface ProfilKaryawan {
  email: string;
  nomor_hp: string;
  nik: string;
  nama: string;
  divisi: string;
  updated_at: Timestamp;
}
