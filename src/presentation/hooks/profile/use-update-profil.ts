import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import { UpdateProfilFormSchema } from "../../validators/update-profil-form-schema";
import { UserViewModel } from "../../viewModels/user-viewModel";

interface ProfilKaryawan {
  nama?: string;
  nik?: string;
  nomor_hp?: string;
}

const useUpdateProfil = (
  uid: string | null,
  profilKaryawan?: ProfilKaryawan | null
) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const vmRef = useRef(new UserViewModel(uid ?? ""));
  const router = useRouter();
  const onPress = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    setError: setFormError,
    reset,
  } = useForm({
    resolver: yupResolver(UpdateProfilFormSchema),
    defaultValues: {
      nama: "",
      nik: "",
      nomor_hp: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // Initialize form dengan data profil saat data dimuat
  useEffect(() => {
    if (profilKaryawan) {
      reset({
        nama: profilKaryawan.nama ?? "",
        nik: profilKaryawan.nik ?? "",
        nomor_hp: profilKaryawan.nomor_hp ?? "",
      });
    }
  }, [profilKaryawan, reset]);

  const onSubmit = async (values: any) => {
    if (!uid) {
      setErrorMsg("UID tidak tersedia.");
      setFormError("root", { type: "manual", message: "UID tidak tersedia." });
      return;
    }

    if (!vmRef.current) vmRef.current = new UserViewModel(uid);

    const payload: { nama?: string; nik?: string; nomor_hp?: string } = {};
    if (values?.nama) payload.nama = String(values.nama).trim();
    if (values?.nik) payload.nik = String(values.nik).replace(/\D+/g, "");
    if (values?.nomor_hp) payload.nomor_hp = String(values.nomor_hp).trim();

    if (Object.keys(payload).length === 0) {
      setFormError("root", {
        type: "manual",
        message: "Tidak ada perubahan untuk disimpan.",
      });
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      await vmRef.current.updateProfil(payload);
      Toast.show({ type: "success", text1: "Profil diperbarui" });
      closeModal();
      reset({
        nama: payload.nama ?? "",
        nik: payload.nik ?? "",
        nomor_hp: payload.nomor_hp ?? "",
      });
      setTimeout(() => {
        router.replace("/(tabs)/profil");
      }, 500);
    } catch (err: any) {
      console.error("Update profil gagal:", err);
      const errorMessage = err?.message ?? "Gagal memperbarui profil.";
      setErrorMsg(errorMessage);
      setFormError("root", {
        type: "server",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfil = handleSubmit(onSubmit);

  // Tombol enable jika ada perubahan dan tidak sedang loading
  const canSubmit = isDirty && !loading && !isSubmitting;

  return {
    loading,
    showModal,
    error: errorMsg,
    canSubmit,
    control,
    errors,
    isSubmitting,
    onPress,
    closeModal,
    handleUpdateProfil,
  };
};

export default useUpdateProfil;
