import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import { Unsubscribe } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";
import { LengkapiProfilData } from "../common/types/user-data";
import { expandHariKerja } from "../common/utils/expand-hari-kerja";
import formatHariKerja from "../common/utils/format-hari-kerja";
import { LengkapiProfilFormSchema } from "../common/validators/profil/update-lengkapi-profil-schema";
import { UserRepositoryImpl } from "../data/repositories/user-repository-impl";
import { LengkapiProfil } from "../domain/models/lengkapi-profil";
import { IUserRepository } from "../domain/repositories/i-user-repository";

const defaultValues: LengkapiProfil = {
  nama: "",
  divisi: "",
  jadwal: {
    jam_masuk: "",
    jam_keluar: "",
    hari_kerja: "",
    is_wfa: false,
  },
};

const useLengkapiProfil = (uid: string | undefined) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingData, setFetchingData] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [showJamMasukPicker, setShowJamMasukPicker] = useState(false);
  const [showJamKeluarPicker, setShowJamKeluarPicker] = useState(false);
  const [selectedHari, setSelectedHari] = useState<number[]>([]);
  const [showDivisiDropdown, setShowDivisiDropdown] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [email, setEmail] = useState("");

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

    const repo: IUserRepository = new UserRepositoryImpl();
    const unsubscribe: Unsubscribe | null = repo.getProfilRealTime(
      uid,
      (data) => {
        if (data) {
          setEmail(data.email || "");
          setValue("nama", data.nama || "", { shouldValidate: false });
          setValue("divisi", data.divisi || "", {
            shouldValidate: false,
          });

          const jadwal = data.jadwal;
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
            setValue("jadwal.is_wfa", jadwal.is_wfa || false, {
              shouldValidate: false,
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

    // Cleanup yang aman
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
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
      if (!uid || !email) {
        throw new Error("UID atau Email tidak tersedia.");
      }

      const userRepo: IUserRepository = new UserRepositoryImpl();

      // untuk Firestore
      const firestoreData: LengkapiProfilData = {
        nama: data.nama,
        divisi: data.divisi,
        jadwal: {
          jam_masuk: data.jadwal.jam_masuk,
          jam_keluar: data.jadwal.jam_keluar,
          hari_kerja: data.jadwal.hari_kerja,
          is_wfa: !!data.jadwal.is_wfa,
        },
      };

      await userRepo.lengkapiProfilWithSync(uid, email, firestoreData);

      setShowConfirmModal(false);
      Toast.show({
        type: "success",
        text1: "Berhasil",
        text2: "Profil berhasil dilengkapi",
      });
      router.replace("/(tabs)");
    } catch (err) {
      console.error("[useLengkapiProfil] save error:", err);
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

export default useLengkapiProfil;
