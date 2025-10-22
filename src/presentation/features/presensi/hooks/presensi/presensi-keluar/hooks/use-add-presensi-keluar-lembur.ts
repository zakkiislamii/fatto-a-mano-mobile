import { JadwalKaryawan } from "@/src/common/types/jadwal-karyawan";
import { PresensiKeluar } from "@/src/common/types/presensi-keluar";
import Today from "@/src/common/utils/get-today";
import { parseJamToDateToday } from "@/src/common/utils/parse-jam-to-date-today";
import { PresensiKeluarRepository } from "@/src/domain/repositories/presensi-keluar-repository";
import { useCallback, useState } from "react";
import Toast from "react-native-toast-message";

interface UseAddPresensiKeluarLemburProps {
  uid: string;
  jadwalKaryawan: JadwalKaryawan | null;
}

const useAddPresensiKeluarLembur = ({
  uid,
  jadwalKaryawan,
}: UseAddPresensiKeluarLemburProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showLemburSheet, setShowLemburSheet] = useState<boolean>(false);
  const [lemburDurasiMenit, setLemburDurasiMenit] = useState<number | null>(
    null
  );

  const calculateLemburDuration = useCallback((): number => {
    if (!jadwalKaryawan) return 0;

    const today = new Date();
    const jamKeluarDate = parseJamToDateToday(jadwalKaryawan.jam_keluar, today);
    if (!jamKeluarDate) return 0;

    const keluarLembur = new Date(jamKeluarDate.getTime() + 30 * 60 * 1000);
    const now = new Date();

    const diffMs = now.getTime() - keluarLembur.getTime();
    const diffMenit = Math.max(0, Math.floor(diffMs / (1000 * 60)));

    return diffMenit >= 30 ? 60 : diffMenit;
  }, [jadwalKaryawan]);

  const openLemburSheet = useCallback(() => {
    const durasi = calculateLemburDuration();
    setLemburDurasiMenit(durasi);
    setShowLemburSheet(true);
  }, [calculateLemburDuration]);

  const closeLemburSheet = useCallback(() => {
    setShowLemburSheet(false);
    setLemburDurasiMenit(null);
  }, []);

  const prosesPresensiKeluarLembur = async (
    durasiLemburMenit: number
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const now = new Date();
      const waktu = now.toISOString();

      const durasiLemburStr = `${durasiLemburMenit} menit`;

      const presensiKeluarData: PresensiKeluar = {
        waktu,
        lembur: true,
        durasi_lembur: durasiLemburStr,
        keluar_awal: false,
      };

      const tanggal = Today();

      const repo = new PresensiKeluarRepository(uid, tanggal);
      repo.setPresensiKeluar(presensiKeluarData);
      await repo.add();

      Toast.show({
        type: "success",
        text1: "Presensi keluar lembur berhasil",
      });

      setShowLemburSheet(false);
      return true;
    } catch (error) {
      console.error("Presensi lembur error:", error);
      Toast.show({
        type: "error",
        text1: "Gagal melakukan presensi keluar lembur",
        text2: "Silahkan coba lagi!",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    showLemburSheet,
    lemburDurasiMenit,
    openLemburSheet,
    closeLemburSheet,
    prosesPresensiKeluarLembur,
  };
};

export default useAddPresensiKeluarLembur;
