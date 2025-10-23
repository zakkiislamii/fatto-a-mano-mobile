import { StatusPengajuan } from "@/src/common/enums/status-pengajuan";
import { TipePengajuan } from "@/src/common/enums/tipe-pengajuan";
import { Timestamp } from "firebase/firestore";

export interface Pengajuan {
  id: string;
  uid: string;
  tipe: TipePengajuan;
  tanggal_pengajuan: string;
  status: StatusPengajuan;
  detail: Record<string, any>;
  created_at: Timestamp;
  updated_at: Timestamp;
}
