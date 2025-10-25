import { Pengajuan } from "@/src/domain/models/pengajuan";
import { StatusPengajuan } from "../enums/status-pengajuan";
import { TipePengajuan } from "../enums/tipe-pengajuan";

export interface PengajuanIzin extends Pengajuan {
  keterangan: string;
  bukti_pendukung: string;
  tanggal_mulai: string;
  tanggal_berakhir: string;
  status: StatusPengajuan;
  tipe: TipePengajuan.izin;
}
