import { Pengajuan } from "./pengajuan";
import { ProfilKaryawan } from "./profil-karyawan";

export interface DetailVerifikasi {
  karyawan: ProfilKaryawan;
  pengajuan: Pengajuan;
}
