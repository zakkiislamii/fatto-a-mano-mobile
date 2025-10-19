import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

interface WifiStatusIndicatorProps {
  wifiLoading: boolean;
  isWifiConnected: boolean;
  isBssid: boolean;
  isDark: boolean;
}

const WifiStatus = ({
  wifiLoading,
  isWifiConnected,
  isBssid,
  isDark,
}: WifiStatusIndicatorProps) => {
  const warningBg = isDark ? "bg-yellow-900/40" : "bg-yellow-200";
  const warningIconColor = isDark ? "#facc15" : "#f59e0b";
  const warningText = isDark ? "text-yellow-300" : "text-yellow-700";
  const errorBg = isDark ? "bg-red-900/40" : "bg-red-200";
  const errorIconColor = isDark ? "#f87171" : "#dc2626";
  const errorText = isDark ? "text-red-300" : "text-red-700";
  const successBg = isDark ? "bg-green-900/40" : "bg-green-200";
  const successIconColor = isDark ? "#4ade80" : "#16a34a";
  const successText = isDark ? "text-green-300" : "text-green-700";

  if (wifiLoading) {
    return (
      <View
        className={`flex-row items-center p-3 rounded-lg ${warningBg} w-full`}
      >
        <ActivityIndicator
          size="small"
          color={warningIconColor}
          className="mr-3"
        />
        <Text className={`font-medium ${warningText}`}>
          Mengecek koneksi WiFi...
        </Text>
      </View>
    );
  }

  if (!isWifiConnected) {
    return (
      <View
        className={`flex-row items-center p-3 rounded-lg ${errorBg} w-full`}
      >
        <AntDesign
          name="wifi"
          size={20}
          color={errorIconColor}
          className="mr-3"
        />
        <Text className={`font-medium ${errorText}`}>
          Koneksi WiFi tidak ditemukan.
        </Text>
      </View>
    );
  }

  if (!isBssid) {
    return (
      <View
        className={`flex-row items-center p-3 rounded-lg ${warningBg} w-full`}
      >
        <AntDesign
          name="wifi"
          size={20}
          color={warningIconColor}
          className="mr-3"
        />
        <Text className={`font-medium ${warningText}`}>
          Anda tidak terhubung ke jaringan WiFi yang benar.
        </Text>
      </View>
    );
  }

  // Jika semua kondisi terpenuhi
  return (
    <View
      className={`flex-row items-center p-3 rounded-lg ${successBg} w-full`}
    >
      <AntDesign
        name="wifi"
        size={20}
        color={successIconColor}
        className="mr-3"
      />
      <Text className={`font-medium ${successText}`}>Koneksi WiFi valid.</Text>
    </View>
  );
};

export default WifiStatus;
