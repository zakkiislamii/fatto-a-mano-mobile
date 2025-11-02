import { RekapKaryawan } from "../models/rekap";

export interface IExcelExportService {
  exportToCSV(rekapData: RekapKaryawan[], fileName?: string): Promise<void>;
  exportToXLSX(rekapData: RekapKaryawan[], fileName?: string): Promise<void>;
}
