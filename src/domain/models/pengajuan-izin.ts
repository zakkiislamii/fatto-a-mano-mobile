import { Pengajuan } from "@/src/domain/models/pengajuan";
import { TipePengajuan } from "../../common/enums/tipe-pengajuan";
import { DetailPengajuanIzin } from "./detail-pengajuan-izin";

export interface PengajuanIzin extends Pengajuan {
  detail: DetailPengajuanIzin;
  tipe: TipePengajuan.IZIN;
}
