import { UserRole } from "@/src/common/enums/user-role";
import { JadwalKaryawan } from "@/src/common/types/jadwal-karyawan";
import { Timestamp } from "firebase/firestore";

export interface User {
  uid: string;
  email: string;
  nomor_hp?: string;
  nik?: string;
  nama?: string;
  role: UserRole;
  divisi?: string;
  jadwal: JadwalKaryawan;
  created_at: Timestamp;
  updated_at: Timestamp;
}
