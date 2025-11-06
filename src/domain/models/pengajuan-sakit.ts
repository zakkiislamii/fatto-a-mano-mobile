import { Pengajuan } from "@/src/domain/models/pengajuan";
import { TipePengajuan } from "../../common/enums/tipe-pengajuan";
import { DetailPengajuanSakit } from "./detail-pengajuan-sakit";

export interface PengajuanSakit extends Pengajuan {
  detail: DetailPengajuanSakit;
  tipe: TipePengajuan.sakit;
}
