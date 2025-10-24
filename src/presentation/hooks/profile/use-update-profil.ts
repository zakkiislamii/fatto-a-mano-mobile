import { UserRepository } from "@/src/domain/repositories/user/user-repository";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import { UpdateProfilFormSchema } from "../../validators/profil/update-profil-form-schema";

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
  const repo = useMemo(() => (uid ? new UserRepository(uid) : null), [uid]);
  const router = useRouter();
  const [showEditSheet, setShowEditSheet] = useState<boolean>(false);

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

  const onSubmit = handleSubmit(async (values) => {
    if (!uid || !repo) {
      Toast.show({
        type: "error",
        text1: "Terjadi kesalahan, silahkan coba lagi!",
      });
      setShowModal(false);
      return;
    }

    const payload: { nama?: string; nik?: string; nomor_hp?: string } = {};

    if (values?.nama && values.nama !== profilKaryawan?.nama) {
      payload.nama = String(values.nama).trim();
    }
    if (values?.nik && values.nik !== profilKaryawan?.nik) {
      payload.nik = String(values.nik).replace(/\D+/g, "").slice(0, 16).trim();
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
      if (payload.nama !== undefined) repo.setNama(payload.nama);
      if (payload.nik !== undefined) repo.setNik(payload.nik);
      if (payload.nomor_hp !== undefined) repo.setNomorHp(payload.nomor_hp);

      await repo.updateProfil();

      setShowModal(false);
      setShowEditSheet(false);
      Toast.show({ type: "success", text1: "Profil diperbarui" });
      reset({
        nama: values.nama ?? "",
        nik: values.nik ?? "",
        nomor_hp: values.nomor_hp ?? "",
      });
      router.replace("/(tabs)/profil");
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

  const openEditSheet = () => setShowEditSheet(true);
  const closeEditSheet = () => setShowEditSheet(false);
  const toggleEditSheet = () => setShowEditSheet((s) => !s);

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
    showEditSheet,
    openEditSheet,
    closeEditSheet,
    toggleEditSheet,
  };
};

export default useUpdateProfil;
