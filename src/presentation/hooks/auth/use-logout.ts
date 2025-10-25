import { UserRole } from "@/src/common/enums/user-role";
import { AuthRepository } from "@/src/domain/repositories/auth/auth-repository";
import { useFirebaseAuth } from "@/src/hooks/use-auth";
import { useDeleteToken } from "@/src/hooks/use-notifikasi";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import Toast from "react-native-toast-message";

const useLogout = () => {
  const { uid, role } = useFirebaseAuth();
  const { mutate: deleteToken } = useDeleteToken();
  const [loading, setLoading] = useState<boolean>(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState<boolean>(false);
  const vmRef = useRef(new AuthRepository());
  const router = useRouter();
  const onLogoutPress = () => setLogoutModalVisible(true);
  const closeLogoutModal = () => setLogoutModalVisible(false);

  const onConfirmLogout = async () => {
    setLoading(true);
    try {
      if (uid && role === UserRole.karyawan) {
        await new Promise<void>((resolve) => {
          deleteToken(uid, {
            onSettled: () => resolve(),
          });
        });
      }

      await vmRef.current.logout();

      setLogoutModalVisible(false);
      router.replace("/(tabs)");
      Toast.show({ type: "success", text1: "Logout Berhasil!" });
    } catch (error: any) {
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
    onConfirmLogout,
    logoutModalVisible,
    onLogoutPress,
    closeLogoutModal,
  };
};

export default useLogout;
