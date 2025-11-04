import { JadwalKaryawan } from "@/src/domain/models/jadwal-karyawan";

export type EditProfilData = {
  nama?: string;
};

export type LengkapiProfilData = {
  nama?: string;
  divisi?: string;
  jadwal?: JadwalKaryawan;
  sheety_id?: number;
};
