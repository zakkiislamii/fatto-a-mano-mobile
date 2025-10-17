import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import Toast from "react-native-toast-message";
import { AuthViewModel } from "../../viewModels/auth-viewModel";

const useLogout = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState<boolean>(false);
  const vmRef = useRef(new AuthViewModel());
  const router = useRouter();
  const onLogoutPress = () => setLogoutModalVisible(true);
  const closeLogoutModal = () => setLogoutModalVisible(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await vmRef.current.logout();
      router.replace("/(tabs)");
      Toast.show({ type: "success", text1: "Logout Berhasil!" });
    } catch (error: any) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onConfirmLogout = async () => {
    await handleLogout();
    setLogoutModalVisible(false);
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
