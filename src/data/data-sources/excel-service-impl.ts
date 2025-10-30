import { Sheets } from "@/src/domain/models/sheets";
import { IExcelService } from "@/src/domain/services/i-excel-service";
import axios from "axios";

export class ExcelServiceImpl implements IExcelService {
  private readonly url: string = process.env.EXPO_PUBLIC_SHEETY_URL || "";

  public async getRows(): Promise<Sheets[]> {
    try {
      const response = await axios.get(this.url);
      return response.data.sheet1;
    } catch (error) {
      console.error("[ExcelService] Error retrieving rows:", error);
      throw error;
    }
  }

  public async addRow(data: Sheets): Promise<any> {
    try {
      const response = await axios.post(this.url, {
        sheet1: data,
      });
      return response.data;
    } catch (error) {
      console.error("[ExcelService] Error adding row:", error);
      throw error;
    }
  }

  public async editRow(id: number, data: Sheets): Promise<any> {
    try {
      if (!id) {
        throw new Error("ID tidak tersedia untuk edit row.");
      }

      const response = await axios.put(`${this.url}/${id}`, {
        sheet1: data,
      });
      return response.data;
    } catch (error) {
      console.error("[ExcelService] Error editing row:", error);
      throw error;
    }
  }
}
