import { PengajuanIzin } from "./pengajuan-izin";
import { PengajuanLembur } from "./pengajuan-lembur";
import { PengajuanSakit } from "./pengajuan-sakit";
import { ProfilKaryawan } from "./profil-karyawan";

export interface DetailVerifikasi {
  karyawan: ProfilKaryawan;
  pengajuan: PengajuanIzin | PengajuanLembur | PengajuanSakit;
}
