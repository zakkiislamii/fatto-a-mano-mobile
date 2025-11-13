import { expandHariKerja } from "@/src/common/utils/expand-hari-kerja";
import formatHariKerja from "@/src/common/utils/format-hari-kerja";
import { EditJadwalKaryawanFormSchema } from "@/src/common/validators/jadwal/edit-jadwal-karyawan-form-schema";
import { NotifikasiServiceImpl } from "@/src/data/data-sources/notifikasi-service-impl";
import { SheetyServiceImpl } from "@/src/data/data-sources/sheety-service-impl";
import { JadwalRepositoryImpl } from "@/src/data/repositories/jadwal-repository-impl";
import { JadwalKaryawan } from "@/src/domain/models/jadwal-karyawan";
import { Sheety } from "@/src/domain/models/sheety";
import { IJadwalRepository } from "@/src/domain/repositories/i-jadwal-repository";
import { INotifikasiService } from "@/src/domain/services/i-notifikasi-service";
import { ISheetyService } from "@/src/domain/services/i-sheety-service";
import { yupResolver } from "@hookform/resolvers/yup";
import { Unsubscribe } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";

const defaultValues: JadwalKaryawan = {
  jam_masuk: "",
  jam_keluar: "",
  hari_kerja: "",
  is_wfa: false,
};

const useEditJadwalKaryawan = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showBottomSheetEditJadwal, setsSowBottomSheetEditJadwal] =
    useState<boolean>(false);
  const [showJamMasukPicker, setShowJamMasukPicker] = useState(false);
  const [showJamKeluarPicker, setShowJamKeluarPicker] = useState(false);
  const [selectedHari, setSelectedHari] = useState<number[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sheetyId, setSheetyId] = useState<number | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const unsubscribeRef = useRef<Unsubscribe | null>(null);

  const {
    control,
    handleSubmit: rhfHandleSubmit,
    formState: { errors, isValid, isDirty, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<JadwalKaryawan>({
    resolver: yupResolver(EditJadwalKaryawanFormSchema),
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const fetchJadwalByUid = useCallback(
    (uid: string) => {
      if (!uid) {
        return;
      }

      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }

      setUid(uid);

      const jadwalRepo: IJadwalRepository = new JadwalRepositoryImpl();
      const unsubscribe = jadwalRepo.getJadwalWithSheetyIdRealTime(
        uid,
        ({ jadwal, sheetyId }) => {
          if (sheetyId) {
            setSheetyId(sheetyId);
          }

          if (jadwal) {
            reset({
              jam_masuk: jadwal.jam_masuk || "",
              jam_keluar: jadwal.jam_keluar || "",
              hari_kerja: jadwal.hari_kerja || "",
              is_wfa: jadwal.is_wfa || false,
            });

            if (jadwal.hari_kerja) {
              const expandedDays = expandHariKerja(jadwal.hari_kerja);
              setSelectedHari(expandedDays);
            }
          }
        }
      );

      unsubscribeRef.current = unsubscribe;
    },
    [reset]
  );

  const openBottomSheetEditJadwal = useCallback(
    (uid: string) => {
      fetchJadwalByUid(uid);
      setsSowBottomSheetEditJadwal(true);
    },
    [fetchJadwalByUid]
  );

  const closeBottomSheetEditJadwal = useCallback(() => {
    setsSowBottomSheetEditJadwal(false);

    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    const currentValues = watch();
    reset(currentValues, {
      keepValues: true,
      keepDefaultValues: false,
    });
  }, [reset, watch]);

  const canSubmit = useMemo(
    () => isValid && !loading && !isSubmitting && isDirty,
    [isValid, loading, isSubmitting, isDirty]
  );

  const handleSaveEditJadwal = rhfHandleSubmit(async (data) => {
    setLoading(true);
    try {
      if (!uid) {
        throw new Error("UID tidak tersedia.");
      }

      const jadwalRepo: IJadwalRepository = new JadwalRepositoryImpl();
      const sheetyService: ISheetyService = new SheetyServiceImpl();
      const notifikasiService: INotifikasiService = new NotifikasiServiceImpl();

      const jadwalData: Partial<JadwalKaryawan> = {
        jam_masuk: data.jam_masuk,
        jam_keluar: data.jam_keluar,
        hari_kerja: data.hari_kerja,
        is_wfa: !!data.is_wfa,
      };

      await jadwalRepo.editJadwalKaryawan(uid, jadwalData);

      if (sheetyId) {
        try {
          const excelData: Partial<Sheety> = {
            hariKerja: data.hari_kerja,
            jamMasuk: data.jam_masuk,
            jamKeluar: data.jam_keluar,
            isWfa: !!data.is_wfa,
          };

          await sheetyService.editRow(sheetyId, excelData);
        } catch (excelError) {
          console.error(
            "[useEditJadwalKaryawan] Gagal update Excel:",
            excelError
          );
        }
      } else {
        console.warn(
          "[useEditJadwalKaryawan] Excel ID tidak ditemukan, skip update Excel"
        );
      }

      let notifStatus = "";
      try {
        await notifikasiService.SendToKaryawan(uid);
        notifStatus = " & notifikasi terkirim";
      } catch (notifError) {
        console.error(
          "[useEditJadwalKaryawan] Gagal kirim notifikasi:",
          notifError
        );
        notifStatus = " (notifikasi gagal)";
      }

      reset({
        jam_masuk: data.jam_masuk,
        jam_keluar: data.jam_keluar,
        hari_kerja: data.hari_kerja,
        is_wfa: data.is_wfa,
      });

      setShowConfirmModal(false);
      closeBottomSheetEditJadwal();

      Toast.show({
        type: "success",
        text1: "Jadwal Berhasil Diperbarui",
        text2: `Perubahan tersimpan${notifStatus}`,
      });
    } catch (err) {
      console.error("[useEditJadwalKaryawan] save error:", err);
      Toast.show({
        type: "error",
        text1: "Gagal menyimpan",
        text2: "Terjadi kesalahan saat menyimpan jadwal",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  });

  const toggleHari = useCallback(
    (day: number) => {
      setSelectedHari((prev) => {
        const newSelection = prev.includes(day)
          ? prev.filter((d) => d !== day)
          : [...prev, day];

        const formatted = formatHariKerja(newSelection);
        setValue("hari_kerja", formatted, {
          shouldValidate: true,
          shouldDirty: true,
        });
        return newSelection;
      });
    },
    [setValue]
  );

  const handleTimeChange = useCallback(
    (selectedDate: Date | undefined, field: "jam_masuk" | "jam_keluar") => {
      if (Platform.OS === "android") {
        if (field === "jam_masuk") setShowJamMasukPicker(false);
        if (field === "jam_keluar") setShowJamKeluarPicker(false);
      }

      if (selectedDate) {
        const hours = selectedDate.getHours().toString().padStart(2, "0");
        const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
        const timeString = `${hours}:${minutes}`;
        setValue(field, timeString, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    },
    [setValue]
  );

  const handleSubmit = useCallback(() => {
    setShowConfirmModal(true);
  }, []);

  const confirmSubmit = useCallback(async () => {
    setShowConfirmModal(false);
    try {
      await handleSaveEditJadwal();
    } catch (err) {
      console.error("Submit error:", err);
    }
  }, [handleSaveEditJadwal]);

  const closeConfirmModal = useCallback(() => {
    setShowConfirmModal(false);
  }, []);

  const openJamMasukPicker = useCallback(() => {
    setShowJamMasukPicker(true);
  }, []);

  const openJamKeluarPicker = useCallback(() => {
    setShowJamKeluarPicker(true);
  }, []);

  return {
    canSubmit,
    loading,
    control,
    errors,
    watch,
    showBottomSheetEditJadwal,
    openBottomSheetEditJadwal,
    closeBottomSheetEditJadwal,
    showConfirmModal,
    closeConfirmModal,
    showJamMasukPicker,
    showJamKeluarPicker,
    openJamMasukPicker,
    openJamKeluarPicker,
    selectedHari,
    toggleHari,
    handleTimeChange,
    handleSubmit,
    confirmSubmit,
  };
};

export default useEditJadwalKaryawan;
