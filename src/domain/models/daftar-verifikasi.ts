import { StatusPengajuan } from "@/src/common/enums/status-pengajuan";
import { TipePengajuan } from "@/src/common/enums/tipe-pengajuan";

export interface DaftarVerifikasi {
  id: string;
  uid: string;
  tipe: TipePengajuan;
  tanggal_pengajuan: string;
  status: StatusPengajuan;
  nama: string;
  divisi: string;
}
