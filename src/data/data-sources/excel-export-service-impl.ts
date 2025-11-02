import { RekapKaryawan, RekapRow } from "@/src/domain/models/rekap";
import { IExcelExportService } from "@/src/domain/services/i-excel-export-service";
import * as Sharing from "expo-sharing";
import { Alert, Platform } from "react-native";
import RNFS from "react-native-fs";

export class ExcelExportServiceImpl implements IExcelExportService {
  public async exportToCSV(
    rekapData: RekapKaryawan[],
    fileName: string = "rekap-presensi.csv"
  ): Promise<void> {
    try {
      // Transform data to CSV rows
      const rows: RekapRow[] = [];

      for (const karyawan of rekapData) {
        for (const presensi of karyawan.presensi_list) {
          rows.push({
            nama: karyawan.nama,
            divisi: karyawan.divisi,
            tanggal: presensi.tanggal || "-",
            status: presensi.status || "-",
            jam_masuk: presensi.presensi_masuk?.waktu || "-",
            terlambat: presensi.presensi_masuk?.terlambat ? "Ya" : "Tidak",
            durasi_terlambat: presensi.presensi_masuk?.durasi_terlambat || "-",
            jam_keluar: presensi.presensi_keluar?.waktu || "-",
            lembur: presensi.presensi_keluar?.lembur ? "Ya" : "Tidak",
            durasi_lembur: presensi.presensi_keluar?.durasi_lembur || "-",
            keluar_awal: presensi.presensi_keluar?.keluar_awal ? "Ya" : "Tidak",
            alasan_keluar_awal:
              presensi.presensi_keluar?.alasan_keluar_awal || "-",
          });
        }
      }

      // Create CSV content
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
      ];

      let csvContent = headers.join(",") + "\n";

      rows.forEach((row) => {
        csvContent +=
          [
            this.escapeCSV(row.nama),
            this.escapeCSV(row.divisi),
            this.escapeCSV(row.tanggal),
            this.escapeCSV(row.status),
            this.escapeCSV(row.jam_masuk),
            this.escapeCSV(row.terlambat),
            this.escapeCSV(row.durasi_terlambat),
            this.escapeCSV(row.jam_keluar),
            this.escapeCSV(row.lembur),
            this.escapeCSV(row.durasi_lembur),
            this.escapeCSV(row.keluar_awal),
            this.escapeCSV(row.alasan_keluar_awal),
          ].join(",") + "\n";
      });

      // 👇 SIMPLE: No permission needed for DownloadDirectoryPath on Android 10+
      const filePath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

      // Write file
      await RNFS.writeFile(filePath, csvContent, "utf8");

      console.log(`[ExcelExportService] File saved to: ${filePath}`);

      // Show success notification
      if (Platform.OS === "android") {
        Alert.alert(
          "Export Berhasil",
          `File tersimpan di:\nDownload/${fileName}`,
          [{ text: "OK" }]
        );
      } else {
        // iOS: Share file
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

  private escapeCSV(value: string): string {
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}
