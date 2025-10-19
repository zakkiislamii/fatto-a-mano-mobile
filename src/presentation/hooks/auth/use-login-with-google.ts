import { AuthRepository } from "@/src/domain/repositories/auth-repository";
import { useRef, useState } from "react";
import Toast from "react-native-toast-message";

export const useLoginWithGoogle = () => {
  const vmRef = useRef(new AuthRepository());
  const [loading, setLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleLoginWithGoogle = async () => {
    setLoading(true);
    setSubmitError(null);
    try {
      await vmRef.current.loginWithGoogle();
      Toast.show({
        type: "success",
        text1: "Login dengan google Berhasil!",
      });
      return true;
    } catch (e: any) {
      setSubmitError(e?.message ?? "Gagal login dengan Google.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    submitError,
    handleLoginWithGoogle,
  };
};
