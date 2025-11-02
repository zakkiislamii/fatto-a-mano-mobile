import { Pengajuan } from "@/src/domain/models/pengajuan";
import { TipePengajuan } from "../../common/enums/tipe-pengajuan";

export interface PengajuanIzin extends Pengajuan {
  keterangan: string;
  bukti_pendukung: string;
  tanggal_mulai: string;
  tanggal_berakhir: string;
  tipe: TipePengajuan.izin;
}
