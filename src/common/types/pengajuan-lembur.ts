import { Pengajuan } from "@/src/domain/models/pengajuan";
import { TipePengajuan } from "../enums/tipe-pengajuan";

export interface PengajuanLembur extends Pengajuan {
  keterangan: string;
  bukti_pendukung: string;
  tipe: TipePengajuan.lembur;
  durasi_lembur: string;
}
