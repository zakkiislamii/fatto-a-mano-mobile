import { UserRole } from "@/src/common/enums/user-role";
import { JadwalKaryawan } from "@/src/domain/models/jadwal-karyawan";
import { Timestamp } from "firebase/firestore";

export interface User {
  uid: string;
  email: string;
  nomor_hp?: string;
  nama?: string;
  role: UserRole;
  divisi?: string;
  jadwal: JadwalKaryawan;
  sheety_id?: number;
  created_at: Timestamp;
  updated_at: Timestamp;
}
