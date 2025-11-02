import {
  EditPengajuanIzinData,
  EditPengajuanLemburData,
  EditPengajuanSakitData,
} from "@/src/common/types/edit-pengajuan-data";
import {
  TambahPengajuanIzinData,
  TambahPengajuanLemburData,
  TambahPengajuanSakitData,
} from "@/src/common/types/tambah-pengajuan-data";
import { DaftarPengajuan } from "@/src/domain/models/daftar-pengajuan";
import { Pengajuan } from "@/src/domain/models/pengajuan";
import { Unsubscribe } from "firebase/firestore";

export interface IPengajuanRepository {
  // --- Fungsi Umum ---
  getDaftar(
    uid: string,
    callback: (pengajuanList: DaftarPengajuan[]) => void
  ): Unsubscribe | null;

  getDetail(
    uid: string,
    pengajuanId: string,
    callback: (pengajuan: Pengajuan | null) => void
  ): Unsubscribe | null;

  hapus(uid: string, pengajuanId: string): Promise<void>;
  // --- Fungsi Umum ---

  // --- Fungsi Spesifik Tipe ---
  tambahIzin(uid: string, data: TambahPengajuanIzinData): Promise<void>;
  tambahLembur(uid: string, data: TambahPengajuanLemburData): Promise<void>;
  tambahSakit(uid: string, data: TambahPengajuanSakitData): Promise<void>;

  editIzin(
    uid: string,
    pengajuanId: string,
    data: EditPengajuanIzinData
  ): Promise<void>;

  editLembur(
    uid: string,
    pengajuanId: string,
    data: EditPengajuanLemburData
  ): Promise<void>;

  editSakit(
    uid: string,
    pengajuanId: string,
    data: EditPengajuanSakitData
  ): Promise<void>;
  // --- Fungsi Spesifik Tipe ---

  //   --- Fungsi Realtime Status ---
  getStatusIzinAktif(
    uid: string,
    tanggalHariIni: string,
    callback: (isIzinAktif: boolean) => void
  ): Unsubscribe | null;

  getStatusSakitAktif(
    uid: string,
    tanggalHariIni: string,
    callback: (isSakitAktif: boolean) => void
  ): Unsubscribe | null;
  //   --- Fungsi Realtime Status ---
}
