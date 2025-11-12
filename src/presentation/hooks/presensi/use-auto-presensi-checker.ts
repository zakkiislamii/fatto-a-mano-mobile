import { StatusPresensi } from "@/src/common/enums/status-presensi";
import { expandHariKerja } from "@/src/common/utils/expand-hari-kerja";
import { getDateTodayWithTime } from "@/src/common/utils/get-date-today-with-time";
import Today from "@/src/common/utils/get-today";
import { PresensiRepositoryImpl } from "@/src/data/repositories/presensi-repository-impl";
import { PresensiMasuk } from "@/src/domain/models/presensi-masuk";
import { useGetJadwal } from "@/src/presentation/hooks/jadwal/use-get-jadwal";
import { useCallback, useEffect, useRef, useState } from "react";
import Toast from "react-native-toast-message";
import useGetStatusPengajuanIzin from "../pengajuan/status-aktif/use-get-status-pengajuan-izin";
import useGetStatusPengajuanSakit from "../pengajuan/status-aktif/use-get-status-pengajuan-sakit";
import useGetStatusPresensiMasukToday from "./presensi-masuk/use-get-status-presensi-masuk-today";

const useAutoPresensiChecker = (uid: string) => {
  const [isAlpa, setIsAlpa] = useState<boolean>(false);
  const { jadwalKaryawan } = useGetJadwal(uid);
  const { presensiMasukStatus, loading: presensiMasukStatusLoading } =
    useGetStatusPresensiMasukToday(uid);
  const { isIzinAktif, loading: izinLoading } = useGetStatusPengajuanIzin(uid);
  const { isSakitAktif, loading: sakitLoading } =
    useGetStatusPengajuanSakit(uid);
  const hasShownAlpaToastRef = useRef<boolean>(false);
  const hasCreatedAlpaRecordRef = useRef<boolean>(false);
  const hasShownIzinToastRef = useRef<boolean>(false);
  const hasCreatedIzinRecordRef = useRef<boolean>(false);
  const hasShownSakitToastRef = useRef<boolean>(false);
  const hasCreatedSakitRecordRef = useRef<boolean>(false);

  const createAutoAlpa = useCallback(async () => {
    if (hasCreatedAlpaRecordRef.current) return;

    try {
      const presensiMasuk: PresensiMasuk = {
        waktu: "",
        terlambat: true,
      };

      const tanggal = Today();
      const presensiRepo = new PresensiRepositoryImpl();
      await presensiRepo.addPresensiMasuk(
        uid,
        tanggal,
        StatusPresensi.ALPA,
        presensiMasuk
      );

      hasCreatedAlpaRecordRef.current = true;
    } catch (err) {
      console.error("[AutoPresensi] createAutoAlpa error:", err);
    }
  }, [uid]);

  const createAutoIzin = useCallback(async () => {
    if (hasCreatedIzinRecordRef.current) return;

    try {
      const presensiMasuk: PresensiMasuk = {
        waktu: "",
        terlambat: false,
      };

      const tanggal = Today();
      const presensiRepo = new PresensiRepositoryImpl();
      await presensiRepo.addPresensiMasuk(
        uid,
        tanggal,
        StatusPresensi.IZIN,
        presensiMasuk
      );

      hasCreatedIzinRecordRef.current = true;
    } catch (err) {
      console.error("[AutoPresensi] createAutoIzin error:", err);
    }
  }, [uid]);

  const createAutoSakit = useCallback(async () => {
    if (hasCreatedSakitRecordRef.current) return;

    try {
      const presensiMasuk: PresensiMasuk = {
        waktu: "",
        terlambat: false,
      };

      const tanggal = Today();
      const presensiRepo = new PresensiRepositoryImpl();
      await presensiRepo.addPresensiMasuk(
        uid,
        tanggal,
        StatusPresensi.SAKIT,
        presensiMasuk
      );

      hasCreatedSakitRecordRef.current = true;
    } catch (err) {
      console.error("[AutoPresensi] createAutoSakit error:", err);
    }
  }, [uid]);

  useEffect(() => {
    if (izinLoading || presensiMasukStatusLoading) return;
    if (isIzinAktif && !presensiMasukStatus.sudah_masuk) {
      if (!hasShownIzinToastRef.current) {
        createAutoIzin();
        Toast.show({
          type: "info",
          text1: "Status: IZIN",
          text2: "Anda sedang dalam periode izin yang disetujui.",
        });
        hasShownIzinToastRef.current = true;
      }
      return;
    }

    // Reset flag jika tidak sedang izin
    if (!isIzinAktif) {
      hasShownIzinToastRef.current = false;
      hasCreatedIzinRecordRef.current = false;
    }
  }, [
    isIzinAktif,
    presensiMasukStatus.sudah_masuk,
    izinLoading,
    presensiMasukStatusLoading,
    createAutoIzin,
  ]);

  useEffect(() => {
    if (sakitLoading || presensiMasukStatusLoading) return;

    // Jika user sedang sakit dan belum ada record presensi
    if (isSakitAktif && !presensiMasukStatus.sudah_masuk) {
      if (!hasShownSakitToastRef.current) {
        createAutoSakit();
        Toast.show({
          type: "info",
          text1: "Status: SAKIT",
          text2: "Anda sedang dalam kondisi sakit yang disetujui.",
        });
        hasShownSakitToastRef.current = true;
      }
      return;
    }

    // Reset flag jika tidak sedang sakit
    if (!isSakitAktif) {
      hasShownSakitToastRef.current = false;
      hasCreatedSakitRecordRef.current = false;
    }
  }, [
    isSakitAktif,
    presensiMasukStatus.sudah_masuk,
    sakitLoading,
    presensiMasukStatusLoading,
    createAutoSakit,
  ]);

  // EFFECT: Handle AUTO ALPA
  useEffect(() => {
    if (
      !jadwalKaryawan ||
      presensiMasukStatusLoading ||
      izinLoading ||
      sakitLoading
    ) {
      hasShownAlpaToastRef.current = false;
      setIsAlpa(false);
      return;
    }

    // Jika sedang izin atau sakit, tidak perlu cek ALPA
    if (isIzinAktif || isSakitAktif) {
      hasShownAlpaToastRef.current = false;
      setIsAlpa(false);
      return;
    }

    const today = new Date();
    const workingDays = expandHariKerja(jadwalKaryawan.hari_kerja);
    const todayIdx = today.getDay();

    // jika hari ini bukan hari kerja -> bukan alpa
    if (!workingDays.includes(todayIdx)) {
      hasShownAlpaToastRef.current = false;
      setIsAlpa(false);
      return;
    }

    const jamKeluarDate = getDateTodayWithTime(
      jadwalKaryawan.jam_keluar,
      today
    );

    if (!jamKeluarDate) {
      hasShownAlpaToastRef.current = false;
      setIsAlpa(false);
      return;
    }

    const now = new Date();

    if (now > jamKeluarDate && !presensiMasukStatus.sudah_masuk) {
      setIsAlpa(true);
      if (!hasShownAlpaToastRef.current) {
        createAutoAlpa();
        Toast.show({
          type: "error",
          text1: "Status: ALPA",
          text2:
            "Waktu presensi masuk telah terlewat. Hubungi HRD untuk pengurusan lebih lanjut.",
        });
        hasShownAlpaToastRef.current = true;
      }
      return;
    }

    hasShownAlpaToastRef.current = false;
    setIsAlpa(false);
  }, [
    jadwalKaryawan,
    presensiMasukStatus,
    presensiMasukStatusLoading,
    isIzinAktif,
    isSakitAktif,
    izinLoading,
    sakitLoading,
    uid,
    createAutoAlpa,
  ]);

  return {
    isAlpa,
    isIzinAktif,
    isSakitAktif,
    izinLoading,
    sakitLoading,
  };
};

export default useAutoPresensiChecker;
