import {
  SheetyPartialResponse,
  SheetyResponse,
} from "@/src/common/types/excel-response";
import { Sheets } from "@/src/domain/models/sheets";

export interface ISheetyService {
  getRows(): Promise<Sheets[]>;
  addRow(data: Sheets): Promise<SheetyResponse>;
  editRow(id: number, data: Partial<Sheets>): Promise<SheetyPartialResponse>;
}
