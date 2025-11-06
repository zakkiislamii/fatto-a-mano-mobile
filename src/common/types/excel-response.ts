import { Sheets } from "@/src/domain/models/sheets";

export interface SheetyResponse {
  sheet1: Sheets;
}

export interface SheetyPartialResponse {
  sheet1: Partial<Sheets>;
}
