import { Pengajuan } from "@/src/domain/models/pengajuan";
import { TipePengajuan } from "../../common/enums/tipe-pengajuan";
import { DetailPengajuanLembur } from "./detail-pengajuan-lembur";

export interface PengajuanLembur extends Pengajuan {
  detail: DetailPengajuanLembur;
  tipe: TipePengajuan.LEMBUR;
}
