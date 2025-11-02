import { expandHariKerja } from "@/src/common/utils/expand-hari-kerja";
import formatHariKerja from "@/src/common/utils/format-hari-kerja";
import { EditJadwalKaryawanFormSchema } from "@/src/common/validators/jadwal/edit-jadwal-karyawan-form-schema";
import { JadwalRepositoryImpl } from "@/src/data/repositories/jadwal-repository-impl";
import { UserRepositoryImpl } from "@/src/data/repositories/user-repository-impl";
import { JadwalKaryawan } from "@/src/domain/models/jadwal-karyawan";
import { Sheets } from "@/src/domain/models/sheets";
import { IJadwalRepository } from "@/src/domain/repositories/i-jadwal-repository";
import { IUserRepository } from "@/src/domain/repositories/i-user-repository";
import { useSendToKaryawan } from "@/src/hooks/use-notifikasi";
import { yupResolver } from "@hookform/resolvers/yup";
import { Unsubscribe } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";
import { useEditRow } from "../sheety/use-sheety";

const defaultValues: JadwalKaryawan = {
  jam_masuk: "",
  jam_keluar: "",
  hari_kerja: "",
  is_wfa: false,
};

const useEditJadwalKaryawan = (uid: string | null) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingData, setFetchingData] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [showJamMasukPicker, setShowJamMasukPicker] = useState(false);
  const [showJamKeluarPicker, setShowJamKeluarPicker] = useState(false);
  const [selectedHari, setSelectedHari] = useState<number[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sheetyId, setsheetyId] = useState<number | null>(null);
  const { mutateAsync: sendNotification } = useSendToKaryawan();
  const { mutateAsync: editExcelRow } = useEditRow();

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
    if (!uid) {
      setFetchingData(false);
      return;
    }

    const userRepo: IUserRepository = new UserRepositoryImpl();
    const unsubscribe: Unsubscribe | null = userRepo.getProfilRealTime(
      uid,
      (profil) => {
        if (profil) {
          if (profil.sheety_id) {
            setsheetyId(profil.sheety_id);
          }

          const jadwal = profil.jadwal;
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
        setFetchingData(false);
      }
    );

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [uid, reset]);

  const openModal = useCallback(() => {
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setError(null);
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
    setError(null);
    setLoading(true);
    try {
      if (!uid) {
        throw new Error("UID tidak tersedia.");
      }

      const jadwalRepo: IJadwalRepository = new JadwalRepositoryImpl();

      const jadwalData: Partial<JadwalKaryawan> = {
        jam_masuk: data.jam_masuk,
        jam_keluar: data.jam_keluar,
        hari_kerja: data.hari_kerja,
        is_wfa: !!data.is_wfa,
      };

      // Update Firestore
      await jadwalRepo.editJadwalKaryawan(uid, jadwalData);

      // Update Google Sheets
      if (sheetyId) {
        try {
          const excelData: Partial<Sheets> = {
            hariKerja: data.hari_kerja,
            jamMasuk: data.jam_masuk,
            jamKeluar: data.jam_keluar,
            isWfa: !!data.is_wfa,
          };

          await editExcelRow({ id: sheetyId, data: excelData });
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

      // Kirim notifikasi
      let notifStatus = "";
      try {
        await sendNotification(uid);
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
      closeModal();

      Toast.show({
        type: "success",
        text1: "Jadwal Berhasil Diperbarui",
        text2: `Perubahan tersimpan${notifStatus}`,
      });
    } catch (err) {
      console.error("[useEditJadwalKaryawan] save error:", err);
      setError(err as Error);
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
    fetchingData,
    control,
    errors,
    watch,
    setValue,
    showModal,
    openModal,
    closeModal,
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
    error,
  };
};

export default useEditJadwalKaryawan;
