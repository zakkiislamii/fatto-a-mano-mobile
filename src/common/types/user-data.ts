import { JadwalKaryawan } from "@/src/domain/models/jadwal-karyawan";

export type EditProfilData = {
  nama?: string;
  nomor_hp?: string;
};

export type LengkapiProfilData = {
  nama?: string;
  nomor_hp?: string;
  divisi?: string;
  jadwal?: JadwalKaryawan;
  sheety_id?: number;
};
