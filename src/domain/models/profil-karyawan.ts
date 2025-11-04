import { Timestamp } from "firebase/firestore";
import { JadwalKaryawan } from "./jadwal-karyawan";

export interface ProfilKaryawan {
  email: string;
  nama: string;
  jadwal?: JadwalKaryawan;
  divisi: string;
  sheety_id: number;
  updated_at: Timestamp;
}
