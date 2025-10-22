import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface WifiStatusProps {
  wifiLoading: boolean;
  isWifiConnected: boolean;
  isBssid: boolean;
  isDark: boolean;
  onRefresh: () => void;
}

const WifiStatus = ({
  wifiLoading,
  isWifiConnected,
  isBssid,
  isDark,
  onRefresh,
}: WifiStatusProps) => {
  const warningBg = isDark ? "bg-yellow-900/40" : "bg-yellow-200";
  const warningIconColor = isDark ? "#facc15" : "#f59e0b";
  const warningText = isDark ? "text-yellow-300" : "text-yellow-700";
  const errorBg = isDark ? "bg-red-900/40" : "bg-red-200";
  const errorIconColor = isDark ? "#f87171" : "#dc2626";
  const errorText = isDark ? "text-red-300" : "text-red-700";
  const successBg = isDark ? "bg-green-900/40" : "bg-green-200";
  const successIconColor = isDark ? "#4ade80" : "#16a34a";
  const successText = isDark ? "text-green-300" : "text-green-700";

  return (
    <View className="w-full">
      {wifiLoading ? (
        <View
          className={`flex-row items-center justify-between p-3 rounded-lg ${warningBg}`}
        >
          <View className="flex-row items-center">
            <ActivityIndicator size="small" color={warningIconColor} />
            <Text className={`ml-3 font-medium ${warningText}`}>
              Mengecek WiFi...
            </Text>
          </View>
          {/* Tombol reload dipindahkan ke sini */}
          <TouchableOpacity onPress={onRefresh} className="p-1">
            <AntDesign name="reload" size={18} color={warningIconColor} />
          </TouchableOpacity>
        </View>
      ) : !isWifiConnected ? (
        <View
          className={`flex-row items-center justify-between p-3 rounded-lg ${errorBg}`}
        >
          <View className="flex-row items-center">
            <AntDesign name="wifi" size={20} color={errorIconColor} />
            <Text className={`ml-3 font-medium ${errorText}`}>
              WiFi tidak ditemukan.
            </Text>
          </View>
          {/* Tombol reload dipindahkan ke sini */}
          <TouchableOpacity onPress={onRefresh} className="p-1">
            <AntDesign name="reload" size={18} color={errorIconColor} />
          </TouchableOpacity>
        </View>
      ) : !isBssid ? (
        <View
          className={`flex-row items-center justify-between p-3 rounded-lg ${warningBg}`}
        >
          <View className="flex-row items-center">
            <AntDesign name="wifi" size={20} color={warningIconColor} />
            <Text className={`ml-3 font-medium ${warningText}`}>
              WiFi tidak sesuai.
            </Text>
          </View>
          {/* Tombol reload dipindahkan ke sini */}
          <TouchableOpacity onPress={onRefresh} className="p-1">
            <AntDesign name="reload" size={18} color={warningIconColor} />
          </TouchableOpacity>
        </View>
      ) : (
        <View
          className={`flex-row items-center justify-between p-3 rounded-lg ${successBg}`}
        >
          <View className="flex-row items-center">
            <AntDesign name="wifi" size={20} color={successIconColor} />
            <Text className={`ml-3 font-medium ${successText}`}>
              WiFi valid.
            </Text>
          </View>
          <TouchableOpacity onPress={onRefresh} className="p-1">
            <AntDesign
              name="reload"
              size={18}
              color={isDark ? "#ffffff" : "#111827"}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default WifiStatus;
