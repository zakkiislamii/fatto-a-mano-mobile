import { UserRole } from "@/src/enums/role";
import { JadwalKaryawan } from "./jadwalKaryawan";

export interface User {
  uid: string;
  email: string;
  nomor_hp: string;
  nik: string;
  nama: string;
  role: UserRole;
  divisi: string;
  jadwal: JadwalKaryawan;
}
