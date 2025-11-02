import { RekapKaryawan } from "@/src/domain/models/rekap";

export interface IExcelExportService {
  exportToCSV(rekapData: RekapKaryawan[], fileName?: string): Promise<void>;
}
