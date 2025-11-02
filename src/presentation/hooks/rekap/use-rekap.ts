import { ExcelExportServiceImpl } from "@/src/data/data-sources/excel-export-service-impl";
import { RekapRepositoryImpl } from "@/src/data/repositories/rekap-repository-impl";
import { RekapKaryawan } from "@/src/domain/models/rekap";
import { IRekapRepository } from "@/src/domain/repositories/i-rekap-repository";
import { IExcelExportService } from "@/src/domain/services/i-excel-export-service";
import { useCallback, useState } from "react";
import Toast from "react-native-toast-message";

const useRekap = () => {
  const [loading, setLoading] = useState(false);
  const [rekapData, setRekapData] = useState<RekapKaryawan[]>([]);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [tanggalMulai, setTanggalMulai] = useState<Date>(new Date());
  const [tanggalAkhir, setTanggalAkhir] = useState<Date>(new Date());

  const openBottomSheet = useCallback(() => {
    setShowBottomSheet(true);
  }, []);

  const closeBottomSheet = useCallback(() => {
    setShowBottomSheet(false);
  }, []);

  const fetchRekap = async (): Promise<RekapKaryawan[]> => {
    setLoading(true);
    try {
      const startStr = tanggalMulai.toISOString().split("T")[0];
      const endStr = tanggalAkhir.toISOString().split("T")[0];

      if (new Date(startStr) > new Date(endStr)) {
        Toast.show({
          type: "error",
          text1: "Tanggal Tidak Valid",
          text2: "Tanggal mulai harus lebih kecil dari tanggal akhir",
        });
        setLoading(false);
        return [];
      }

      const repo: IRekapRepository = new RekapRepositoryImpl();
      const data = await repo.getRekapPresensi(startStr, endStr);

      setRekapData(data);

      Toast.show({
        type: "success",
        text1: "Rekap Berhasil Dimuat",
        text2: `${data.length} karyawan ditemukan`,
      });

      console.log(`[useRekap] Fetched rekap for ${data.length} employees`);

      return data; // ✅ Return data langsung
    } catch (error) {
      console.error("[useRekap] Error fetching rekap:", error);
      Toast.show({
        type: "error",
        text1: "Gagal Memuat Rekap",
        text2: "Terjadi kesalahan saat mengambil data rekap",
      });
      setLoading(false);
      return [];
    }
  };

  const exportToExcel = async (data: RekapKaryawan[]) => {
    if (data.length === 0) {
      Toast.show({
        type: "info",
        text1: "Tidak Ada Data",
        text2: "Silakan muat data rekap terlebih dahulu",
      });
      return;
    }

    try {
      const excelService: IExcelExportService = new ExcelExportServiceImpl();
      const fileName = `rekap-presensi-${new Date().getTime()}.csv`;

      await excelService.exportToCSV(data, fileName);

      Toast.show({
        type: "success",
        text1: "Export Berhasil",
        text2: "File tersimpan di folder Downloads",
      });
    } catch (error) {
      console.error("[useRekap] Error exporting:", error);
      Toast.show({
        type: "error",
        text1: "Export Gagal",
        text2: "Terjadi kesalahan saat mengekspor file",
      });
    }
  };

  const handleFetchAndExport = useCallback(async () => {
    const data = await fetchRekap();

    if (data.length > 0) {
      await exportToExcel(data);
    }

    setLoading(false);
    closeBottomSheet();
  }, [tanggalMulai, tanggalAkhir]);

  return {
    loading,
    rekapData,
    showBottomSheet,
    openBottomSheet,
    closeBottomSheet,
    tanggalMulai,
    tanggalAkhir,
    setTanggalMulai,
    setTanggalAkhir,
    fetchRekap,
    exportToExcel,
    handleFetchAndExport,
  };
};

export default useRekap;
