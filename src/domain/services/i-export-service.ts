import { RekapKaryawan } from "../models/rekap";

export interface IExportService {
  exportToCSV(rekapData: RekapKaryawan[], fileName?: string): Promise<void>;
  exportToXLSX(rekapData: RekapKaryawan[], fileName?: string): Promise<void>;
}
