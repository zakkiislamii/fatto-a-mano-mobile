import { JadwalKaryawan } from "@/src/common/types/jadwal-karyawan";

export type EditProfilData = {
  nama?: string;
  nomor_hp?: string;
};

export type LengkapiProfilData = {
  nama?: string;
  nomor_hp?: string;
  divisi?: string;
  jadwal?: JadwalKaryawan;
};
