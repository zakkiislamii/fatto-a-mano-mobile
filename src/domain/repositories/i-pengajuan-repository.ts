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
  addPengajuanIzin(uid: string, data: DetailPengajuanIzin): Promise<void>;
  addPengajuanLembur(uid: string, data: DetailPengajuanLembur): Promise<void>;
  addPengajuanSakit(uid: string, data: DetailPengajuanSakit): Promise<void>;
  editPengajuanIzin(
    uid: string,
    pengajuanId: string,
    data: Partial<DetailPengajuanIzin>
  ): Promise<void>;
  editPengajuanLembur(
    uid: string,
    pengajuanId: string,
    data: Partial<DetailPengajuanLembur>
  ): Promise<void>;
  editPengajuanSakit(
    uid: string,
    pengajuanId: string,
    data: Partial<DetailPengajuanSakit>
  ): Promise<void>;

  getStatusPengajuanIzin(
    uid: string,
    tanggalHariIni: string,
    callback: (isIzinAktif: boolean) => void
  ): Unsubscribe | null;

  getStatusPengajuanSakit(
    uid: string,
    tanggalHariIni: string,
    callback: (isSakitAktif: boolean) => void
  ): Unsubscribe | null;
}
