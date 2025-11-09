import { StatusPengajuan } from "@/src/common/enums/status-pengajuan";
import { Unsubscribe } from "firebase/firestore";
import { DaftarVerifikasi } from "../models/daftar-verifikasi";
import { DetailVerifikasi } from "../models/detail-verifikasi";

export interface IVerifikasiRepository {
  getAllVerifikasi(
    callback: (verifikasiList: DaftarVerifikasi[]) => void
  ): Unsubscribe | null;

  getDetailKaryawan(
    uid: string,
    pengajuanId: string,
    callback: (detail: DetailVerifikasi | null) => void
  ): Unsubscribe | null;

  verifikasiPengajuan(
    uid: string,
    pengajuanId: string,
    status: StatusPengajuan.DISETUJUI | StatusPengajuan.DITOLAK
  ): Promise<void>;
}
