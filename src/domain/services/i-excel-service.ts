import { Sheets } from "@/src/domain/models/sheets";

export interface IExcelService {
  getRows(): Promise<Sheets[]>;
  addRow(data: Sheets): Promise<any>;
  editRow(id: number, data: Sheets): Promise<any>;
}
