import {
  SheetyPartialResponse,
  SheetyResponse,
} from "@/src/common/types/sheety-response";
import { Sheety } from "@/src/domain/models/sheety";

export interface ISheetyService {
  getRows(): Promise<Sheety[]>;
  addRow(data: Sheety): Promise<SheetyResponse>;
  editRow(id: number, data: Partial<Sheety>): Promise<SheetyPartialResponse>;
}
