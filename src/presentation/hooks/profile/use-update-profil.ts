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
  const vmRef = useRef<UserViewModel | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (uid) {
      vmRef.current = new UserViewModel(uid);
    }
  }, [uid]);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    setError: setFormError,
    reset,
    trigger,
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

  useEffect(() => {
    if (profilKaryawan) {
      const cleanedNik = String(profilKaryawan.nik ?? "")
        .replace(/\D+/g, "")
        .slice(0, 16);

      reset({
        nama: profilKaryawan.nama ?? "",
        nik: cleanedNik,
        nomor_hp: profilKaryawan.nomor_hp ?? "",
      });
    }
  }, [profilKaryawan, reset]);

  const onSubmit = handleSubmit(async (values: any) => {
    if (!uid) {
      setErrorMsg("UID tidak tersedia.");
      Toast.show({ type: "error", text1: "UID tidak tersedia" });
      setShowModal(false);
      return;
    }

    vmRef.current = new UserViewModel(uid);
    const payload: { nama?: string; nik?: string; nomor_hp?: string } = {};

    if (values?.nama && values.nama !== profilKaryawan?.nama) {
      payload.nama = String(values.nama).trim();
    }
    if (values?.nik && values.nik !== profilKaryawan?.nik) {
      payload.nik = String(values.nik).replace(/\D+/g, "").slice(0, 16);
    }
    if (values?.nomor_hp && values.nomor_hp !== profilKaryawan?.nomor_hp) {
      payload.nomor_hp = String(values.nomor_hp).trim();
    }

    if (Object.keys(payload).length === 0) {
      Toast.show({ type: "info", text1: "Tidak ada perubahan" });
      setShowModal(false);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      if (!vmRef.current) {
        throw new Error("ViewModel tidak terinisialisasi");
      }

      await vmRef.current.updateProfil(payload);
      Toast.show({ type: "success", text1: "Profil diperbarui" });
      setShowModal(false);

      reset({
        nama: values.nama ?? "",
        nik: values.nik ?? "",
        nomor_hp: values.nomor_hp ?? "",
      });

      setTimeout(() => {
        router.replace("/(tabs)/profil");
      }, 500);
    } catch (err: any) {
      const errorMessage = err?.message ?? "Gagal memperbarui profil.";
      setErrorMsg(errorMessage);
      setFormError("root", {
        type: "server",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  });

  const onPress = async () => {
    if (!isDirty) {
      Toast.show({ type: "info", text1: "Belum ada perubahan" });
      return;
    }

    const isValid = await trigger();

    if (!isValid) {
      Toast.show({
        type: "error",
        text1: "Periksa kembali data yang Anda input",
      });
      return;
    }

    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);
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
    handleUpdateProfil: onSubmit,
  };
};

export default useUpdateProfil;
