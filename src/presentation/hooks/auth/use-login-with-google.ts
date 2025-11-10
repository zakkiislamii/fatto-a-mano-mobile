import { AuthRepositoryImpl } from "@/src/data/repositories/auth-repository-impl";
import { IAuthRepository } from "@/src/domain/repositories/i-auth-repository";
import { useState } from "react";
import Toast from "react-native-toast-message";

export const useLoginWithGoogle = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleLoginWithGoogle = async (): Promise<boolean> => {
    setLoading(true);
    setSubmitError(null);
    try {
      const authRepo: IAuthRepository = new AuthRepositoryImpl();
      await authRepo.loginWithGoogle();
      Toast.show({
        type: "success",
        text1: "Login dengan Google berhasil!",
      });
      return true;
    } catch (e: any) {
      const message = e?.message ?? "Gagal login dengan Google.";
      setSubmitError(message);
      Toast.show({ type: "error", text1: message });
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
