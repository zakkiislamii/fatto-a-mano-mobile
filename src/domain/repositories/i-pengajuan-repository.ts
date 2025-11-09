import { DaftarPengajuan } from "@/src/domain/models/daftar-pengajuan";
import { Pengajuan } from "@/src/domain/models/pengajuan";
import { Unsubscribe } from "firebase/firestore";
import { DetailPengajuanIzin } from "../models/detail-pengajuan-izin";
import { DetailPengajuanLembur } from "../models/detail-pengajuan-lembur";
import { DetailPengajuanSakit } from "../models/detail-pengajuan-sakit";

export interface IPengajuanRepository {
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
  tambahIzin(uid: string, data: DetailPengajuanIzin): Promise<void>;
  tambahLembur(uid: string, data: DetailPengajuanLembur): Promise<void>;
  tambahSakit(uid: string, data: DetailPengajuanSakit): Promise<void>;
  editIzin(
    uid: string,
    pengajuanId: string,
    data: Partial<DetailPengajuanIzin>
  ): Promise<void>;
  editLembur(
    uid: string,
    pengajuanId: string,
    data: Partial<DetailPengajuanLembur>
  ): Promise<void>;
  editSakit(
    uid: string,
    pengajuanId: string,
    data: Partial<DetailPengajuanSakit>
  ): Promise<void>;

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
}
