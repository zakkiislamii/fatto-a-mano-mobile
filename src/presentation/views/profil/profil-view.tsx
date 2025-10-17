import { DynamicModal } from "@/src/components/ui/dynamic-modal";
import { useFirebaseAuth } from "@/src/hooks/use-auth";
import useLogout from "@/src/presentation/hooks/auth/use-logout";
import React from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetProfile } from "../../hooks/profile/use-get-profil";
import AccountInfoCard from "./components/account-info-card";
import AccountSettingsCard from "./components/account-settings-card";

const ProfilView = () => {
  const colorScheme = useColorScheme();
  const { uid } = useFirebaseAuth();
  const {
    loading: loggingOut,
    onConfirmLogout,
    logoutModalVisible,
    onLogoutPress,
    closeLogoutModal,
  } = useLogout();
  const isDark = colorScheme === "dark";
  const textColor = isDark ? "text-textPrimaryDark" : "text-textPrimaryLight";
  const secondaryTextColor = isDark
    ? "text-textSecondaryDark"
    : "text-textSecondaryLight";
  const cardBg = isDark ? "bg-cardDark" : "bg-cardLight";
  const screenBg = isDark ? "bg-screenDark" : "bg-screenLight";
  const { profilKaryawan, loading, error } = useGetProfile(uid ?? null);

  return (
    <SafeAreaView className={`flex-1 ${screenBg}`}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="p-6">
          {/* Header */}
          <View className="mb-6">
            <Text className={`text-3xl font-bold ${textColor}`}>
              Profil Saya
            </Text>
            <Text className={`text-base ${secondaryTextColor}`}>
              Kelola informasi akun Anda di bawah ini.
            </Text>
          </View>
          <AccountInfoCard
            profilKaryawan={profilKaryawan}
            isDark={isDark}
            textColor={textColor}
            cardBg={cardBg}
            loading={loading}
            error={error}
            secondaryTextColor={secondaryTextColor}
          />
          <AccountSettingsCard
            loggingOut={loggingOut}
            onLogoutPress={onLogoutPress}
            textColor={textColor}
            secondaryTextColor={secondaryTextColor}
            cardBg={cardBg}
          />
        </View>
      </ScrollView>
      <DynamicModal
        isVisible={logoutModalVisible}
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin keluar dari akun?"
        isDark={isDark}
        onClose={closeLogoutModal}
        secondaryButtonText="Batal"
        onSecondaryButtonPress={closeLogoutModal}
        primaryButtonText={loggingOut ? "Memproses..." : "Logout"}
        onPrimaryButtonPress={onConfirmLogout}
      />
    </SafeAreaView>
  );
};
export default ProfilView;
