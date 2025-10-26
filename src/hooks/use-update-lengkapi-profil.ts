import { UserRepository } from "@/src/domain/repositories/user/user-repository";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";
import { LengkapiProfil } from "../common/types/lengkapi-profil";
import { expandHariKerja } from "../common/utils/expand-hari-kerja";
import formatHariKerja from "../common/utils/format-hari-kerja";
import { LengkapiProfilFormSchema } from "../presentation/validators/profil/update-lengkapi-profil-schema";

const defaultValues: LengkapiProfil = {
  nama: "",
  nik: "",
  divisi: "",
  nomor_hp: "",
  jadwal: {
    jam_masuk: "",
    jam_keluar: "",
    hari_kerja: "",
    is_wfh: false,
  },
};

const useUpdateLengkapiProfil = (uid: string | undefined) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingData, setFetchingData] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [showJamMasukPicker, setShowJamMasukPicker] = useState(false);
  const [showJamKeluarPicker, setShowJamKeluarPicker] = useState(false);
  const [selectedHari, setSelectedHari] = useState<number[]>([]);
  const [showDivisiDropdown, setShowDivisiDropdown] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const {
    control,
    handleSubmit: rhfHandleSubmit,
    formState: { errors, isValid, isDirty, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<LengkapiProfil>({
    resolver: yupResolver(LengkapiProfilFormSchema),
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (!uid) {
      setFetchingData(false);
      return;
    }

    const repo = new UserRepository(uid);
    const unsubscribe = repo.getProfilRealTime((data) => {
      if (data) {
        setValue("nama", data.nama || "", { shouldValidate: false });
        setValue("nik", data.nik || "", { shouldValidate: false });
        setValue("nomor_hp", data.nomor_hp || "", { shouldValidate: false });
        setValue("divisi", (data as any).divisi || "", {
          shouldValidate: false,
        });
        const jadwal = (data as any).jadwal;
        if (jadwal) {
          setValue("jadwal.jam_masuk", jadwal.jam_masuk || "", {
            shouldValidate: false,
          });
          setValue("jadwal.jam_keluar", jadwal.jam_keluar || "", {
            shouldValidate: false,
          });
          setValue("jadwal.hari_kerja", jadwal.hari_kerja || "", {
            shouldValidate: false,
          });
          setValue("jadwal.is_wfh", jadwal.is_wfh || false, {
            shouldValidate: false,
          });
          if (jadwal.hari_kerja) {
            const expandedDays = expandHariKerja(jadwal.hari_kerja);
            setSelectedHari(expandedDays);
          }
        }
      }
      setFetchingData(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [uid, setValue]);

  const openModal = useCallback(() => {
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    reset(defaultValues);
    setError(null);
  }, [reset]);

  const canSubmit = useMemo(
    () => isValid && !loading && !isSubmitting && isDirty,
    [isValid, loading, isSubmitting, isDirty]
  );

  const handleSaveUpdateLengkapiProfil = rhfHandleSubmit(async (data) => {
    setError(null);
    setLoading(true);
    try {
      if (!uid) throw new Error("UID tidak tersedia.");
      console.log("data: ", data);
      const repo = new UserRepository(uid);

      repo.setNama(data.nama);
      repo.setNik(data.nik);
      repo.setNomorHp(data.nomor_hp);
      repo.setDivisi(data.divisi);
      repo.setJadwal({
        jam_masuk: data.jadwal.jam_masuk,
        jam_keluar: data.jadwal.jam_keluar,
        hari_kerja: data.jadwal.hari_kerja,
        is_wfh: !!data.jadwal.is_wfh,
      });

      await repo.updateLengkapiProfil();

      setShowConfirmModal(false);
      Toast.show({
        type: "success",
        text1: "Berhasil",
        text2: "Profil berhasil dilengkapi",
      });
      router.replace("/(tabs)");
    } catch (err) {
      console.error("[useUpdateLengkapiProfil] save error:", err);
      setError(err as Error);
      Toast.show({
        type: "error",
        text1: "Gagal menyimpan",
        text2: "Terjadi kesalahan saat menyimpan profil",
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
        setValue("jadwal.hari_kerja", formatted, {
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
        setValue(`jadwal.${field}`, timeString, {
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
      await handleSaveUpdateLengkapiProfil();
    } catch (err) {
      console.error("Submit error:", err);
    }
  }, [handleSaveUpdateLengkapiProfil]);

  const closeConfirmModal = useCallback(() => {
    setShowConfirmModal(false);
  }, []);

  const toggleDivisiDropdown = useCallback(() => {
    setShowDivisiDropdown((prev) => !prev);
  }, []);

  const closeDivisiDropdown = useCallback(() => {
    setShowDivisiDropdown(false);
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
    showDivisiDropdown,
    toggleDivisiDropdown,
    closeDivisiDropdown,
    selectedHari,
    toggleHari,
    handleTimeChange,
    handleSubmit,
    confirmSubmit,
    error,
  };
};

export default useUpdateLengkapiProfil;
