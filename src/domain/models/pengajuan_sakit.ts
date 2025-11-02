import { Pengajuan } from "@/src/domain/models/pengajuan";
import { TipePengajuan } from "../../common/enums/tipe-pengajuan";

export interface PengajuanSakit extends Pengajuan {
  keterangan: string;
  bukti_pendukung: string;
  tipe: TipePengajuan.sakit;
}
