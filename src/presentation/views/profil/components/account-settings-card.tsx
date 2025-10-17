import Button from "@/src/components/ui/button";
import React from "react";
import { Text, View } from "react-native";

interface Props {
  loggingOut: boolean;
  onLogoutPress: () => void;
  textColor: string;
  secondaryTextColor: string;
  cardBg: string;
}

const AccountSettingsCard = ({
  loggingOut,
  onLogoutPress,
  textColor,
  secondaryTextColor,
  cardBg,
}: Props) => {
  return (
    <View className={`${cardBg} rounded-xl p-6 mb-6 shadow-sm`}>
      <Text className={`text-lg font-bold ${textColor} mb-5`}>
        Pengaturan Akun
      </Text>
      <Button
        title="Logout"
        onPress={onLogoutPress}
        disabled={loggingOut}
        loading={loggingOut}
        className="bg-red-600/90 flex-row items-center justify-center rounded-lg p-3"
        textClassName="text-white font-bold text-base"
      />
      <Text className={`text-xs ${secondaryTextColor} text-center mt-4`}>
        Anda akan dikembalikan ke halaman login setelah keluar.
      </Text>
    </View>
  );
};
export default AccountSettingsCard;
