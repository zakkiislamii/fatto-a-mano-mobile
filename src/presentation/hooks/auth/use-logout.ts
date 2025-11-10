import { UserRole } from "@/src/common/enums/user-role";
import { AuthRepositoryImpl } from "@/src/data/repositories/auth-repository-impl";
import { IAuthRepository } from "@/src/domain/repositories/i-auth-repository";
import { useDeleteToken } from "@/src/hooks/use-notifikasi";
import { useRouter } from "expo-router";
import { useState } from "react";
import Toast from "react-native-toast-message";

const useLogout = () => {
  const { mutateAsync: deleteToken } = useDeleteToken();
  const [loading, setLoading] = useState<boolean>(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState<boolean>(false);
  const router = useRouter();
  const onLogoutPress = () => setLogoutModalVisible(true);
  const closeLogoutModal = () => setLogoutModalVisible(false);

  const handleLogout = async (uid: string, role: UserRole) => {
    setLoading(true);
    try {
      const authRepo: IAuthRepository = new AuthRepositoryImpl();
      if (uid && role === UserRole.KARYAWAN) {
        try {
          await deleteToken(uid);
        } catch (tokenError) {
          console.error("Delete token error (non-blocking):", tokenError);
        }
      }

      await authRepo.logout();

      setLogoutModalVisible(false);
      router.replace("/(tabs)");
      Toast.show({ type: "success", text1: "Logout Berhasil!" });
    } catch (error: unknown) {
      console.error("Logout error:", error);
      Toast.show({
        type: "error",
        text1: "Logout Gagal",
        text2: "Terjadi kesalahan",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleLogout,
    logoutModalVisible,
    onLogoutPress,
    closeLogoutModal,
  };
};

export default useLogout;
