import {
  ExcelPartialResponse,
  ExcelResponse,
} from "@/src/common/types/excel-response";
import { Sheets } from "@/src/domain/models/sheets";

export interface IExcelService {
  getRows(): Promise<Sheets[]>;
  addRow(data: Sheets): Promise<ExcelResponse>;
  editRow(id: number, data: Partial<Sheets>): Promise<ExcelPartialResponse>;
}
