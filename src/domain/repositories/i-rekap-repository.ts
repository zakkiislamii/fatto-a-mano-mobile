import { RekapKaryawan } from "@/src/domain/models/rekap";

export interface IRekapRepository {
  getRekapPresensi(
    tanggalMulai: string,
    tanggalAkhir: string
  ): Promise<RekapKaryawan[]>;
}
