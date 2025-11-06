import { Pengajuan } from "@/src/domain/models/pengajuan";
import { TipePengajuan } from "../../common/enums/tipe-pengajuan";

export interface PengajuanLembur extends Pengajuan {
  detail: {
    keterangan: string;
    bukti_pendukung: string;
    durasi_lembur: string;
  };
  tipe: TipePengajuan.lembur;
}
