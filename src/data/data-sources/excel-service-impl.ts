import {
  ExcelPartialResponse,
  ExcelResponse,
} from "@/src/common/types/excel-response";
import { Sheets } from "@/src/domain/models/sheets";
import { IExcelService } from "@/src/domain/services/i-excel-service";
import axios from "axios";

export class ExcelServiceImpl implements IExcelService {
  private readonly url: string = process.env.EXPO_PUBLIC_BE_URL || "";

  public async getRows(): Promise<Sheets[]> {
    try {
      const response = await axios.get(`${this.url}/sheety`);
      return response.data.sheet1;
    } catch (error) {
      console.error("[ExcelService] Error retrieving rows:", error);
      throw error;
    }
  }

  public async addRow(data: Sheets): Promise<ExcelResponse> {
    try {
      const response = await axios.post<ExcelResponse>(
        `${this.url}/sheety`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("[ExcelService] Error adding row:", error);
      throw error;
    }
  }

  public async editRow(
    id: number,
    data: Partial<Sheets>
  ): Promise<ExcelPartialResponse> {
    try {
      if (!id) {
        throw new Error("ID tidak tersedia untuk edit row.");
      }

      const response = await axios.put<ExcelPartialResponse>(
        `${this.url}/sheety/${id}`,
        data
      );

      return response.data;
    } catch (error) {
      console.error("[ExcelService] Error editing row:", error);
      throw error;
    }
  }
}
