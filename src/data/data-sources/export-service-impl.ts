import { RekapKaryawan } from "@/src/domain/models/rekap";
import { IExportService } from "@/src/domain/services/i-export-service";
import * as Sharing from "expo-sharing";
import { Alert, Platform } from "react-native";
import RNFS from "react-native-fs";
import * as XLSX from "xlsx";

export class ExportServiceImpl implements IExportService {
  public async exportToCSV(
    rekapData: RekapKaryawan[],
    fileName: string = "rekap-presensi.csv"
  ): Promise<void> {
    try {
      const startTime = performance.now();

      const csvLines: string[] = [];

      const headers = [
        "Nama",
        "Divisi",
        "Tanggal",
        "Status",
        "Jam Masuk",
        "Terlambat",
        "Durasi Terlambat",
        "Jam Keluar",
        "Lembur",
        "Durasi Lembur",
        "Keluar Awal",
        "Alasan Keluar Awal",
        "Bukti Keluar Awal",
      ];

      csvLines.push(headers.join(","));

      for (const karyawan of rekapData) {
        for (const presensi of karyawan.presensi_list) {
          const row = [
            this.escapeCSV(karyawan.nama),
            this.escapeCSV(karyawan.divisi),
            this.escapeCSV(presensi.tanggal || "-"),
            this.escapeCSV(presensi.status || "-"),
            this.escapeCSV(presensi.presensi_masuk?.waktu || "-"),
            this.escapeCSV(presensi.presensi_masuk?.terlambat ? "Ya" : "Tidak"),
            this.escapeCSV(presensi.presensi_masuk?.durasi_terlambat || "-"),
            this.escapeCSV(presensi.presensi_keluar?.waktu || "-"),
            this.escapeCSV(presensi.presensi_keluar?.lembur ? "Ya" : "Tidak"),
            this.escapeCSV(presensi.presensi_keluar?.durasi_lembur || "-"),
            this.escapeCSV(
              presensi.presensi_keluar?.keluar_awal ? "Ya" : "Tidak"
            ),
            this.escapeCSV(presensi.presensi_keluar?.alasan_keluar_awal || "-"),
            this.escapeCSV(presensi.presensi_keluar?.bukti_keluar_awal || "-"),
          ];

          csvLines.push(row.join(","));
        }
      }

      const csvContent = csvLines.join("\n");
      const filePath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
      await RNFS.writeFile(filePath, csvContent, "utf8");

      if (Platform.OS === "android") {
        Alert.alert(
          "Export Berhasil",
          `File tersimpan di:\nDownload/${fileName}`,
          [{ text: "OK" }]
        );
      } else {
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(`file://${filePath}`, {
            mimeType: "text/csv",
            dialogTitle: "Simpan Rekap Presensi",
          });
        }
      }
    } catch (error) {
      console.error("[ExcelExportService] Error exporting CSV:", error);
      throw error;
    }
  }

  public async exportToXLSX(
    rekapData: RekapKaryawan[],
    fileName: string = "rekap-presensi.xlsx"
  ): Promise<void> {
    try {
      const startTime = performance.now();
      const rows: any[] = [];

      for (const karyawan of rekapData) {
        for (const presensi of karyawan.presensi_list) {
          rows.push({
            Nama: karyawan.nama,
            Divisi: karyawan.divisi,
            Tanggal: presensi.tanggal || "-",
            Status: presensi.status || "-",
            "Jam Masuk": presensi.presensi_masuk?.waktu || "-",
            Terlambat: presensi.presensi_masuk?.terlambat ? "Ya" : "Tidak",
            "Durasi Terlambat":
              presensi.presensi_masuk?.durasi_terlambat || "-",
            "Jam Keluar": presensi.presensi_keluar?.waktu || "-",
            Lembur: presensi.presensi_keluar?.lembur ? "Ya" : "Tidak",
            "Durasi Lembur": presensi.presensi_keluar?.durasi_lembur || "-",
            "Keluar Awal": presensi.presensi_keluar?.keluar_awal
              ? "Ya"
              : "Tidak",
            "Alasan Keluar Awal":
              presensi.presensi_keluar?.alasan_keluar_awal || "-",
            "Bukti Keluar Awal":
              presensi.presensi_keluar?.bukti_keluar_awal || "-",
          });
        }
      }

      const worksheet = XLSX.utils.json_to_sheet(rows);

      const columnWidths = [
        { wch: 30 }, // Nama
        { wch: 13 }, // Divisi
        { wch: 12 }, // Tanggal
        { wch: 10 }, // Status
        { wch: 12 }, // Jam Masuk
        { wch: 10 }, // Terlambat
        { wch: 15 }, // Durasi Terlambat
        { wch: 12 }, // Jam Keluar
        { wch: 10 }, // Lembur
        { wch: 15 }, // Durasi Lembur
        { wch: 12 }, // Keluar Awal
        { wch: 25 }, // Alasan Keluar Awal
        { wch: 30 }, // Bukti Keluar Awal
      ];
      worksheet["!cols"] = columnWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Presensi");

      const xlsxBinary = XLSX.write(workbook, {
        type: "binary",
        bookType: "xlsx",
      });

      const base64 = this.binaryToBase64(xlsxBinary);
      const filePath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
      await RNFS.writeFile(filePath, base64, "base64");

      if (Platform.OS === "android") {
        Alert.alert(
          "Export Berhasil",
          `File Excel tersimpan di:\nDownload/${fileName}`,
          [{ text: "OK" }]
        );
      } else {
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(`file://${filePath}`, {
            mimeType:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            dialogTitle: "Simpan Rekap Presensi",
          });
        }
      }
    } catch (error) {
      console.error("[ExcelExportService] Error exporting XLSX:", error);
      throw error;
    }
  }

  private binaryToBase64(binary: string): string {
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    let base64 = "";
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    for (let i = 0; i < bytes.length; i += 3) {
      const byte1 = bytes[i];
      const byte2 = i + 1 < bytes.length ? bytes[i + 1] : 0;
      const byte3 = i + 2 < bytes.length ? bytes[i + 2] : 0;

      const encoded1 = byte1 >> 2;
      const encoded2 = ((byte1 & 3) << 4) | (byte2 >> 4);
      const encoded3 = ((byte2 & 15) << 2) | (byte3 >> 6);
      const encoded4 = byte3 & 63;

      base64 += chars[encoded1] + chars[encoded2];
      base64 += i + 1 < bytes.length ? chars[encoded3] : "=";
      base64 += i + 2 < bytes.length ? chars[encoded4] : "=";
    }

    return base64;
  }

  private escapeCSV(value: string): string {
    if (!value.includes(",") && !value.includes('"') && !value.includes("\n")) {
      return value;
    }
    return `"${value.replace(/"/g, '""')}"`;
  }
}
