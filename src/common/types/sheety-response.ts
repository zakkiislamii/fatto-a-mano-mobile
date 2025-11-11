import { Sheety } from "@/src/domain/models/sheety";

export interface SheetyResponse {
  sheet1: Sheety;
}

export interface SheetyPartialResponse {
  sheet1: Partial<Sheety>;
}
