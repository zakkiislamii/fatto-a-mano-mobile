import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface MapInfoProps {
  isDark: boolean;
}

const MapInfo = ({ isDark }: MapInfoProps) => {
  const infoIconColor = isDark ? "#c7d2fe" : "#3730a3";
  const infoText = isDark ? "text-blue-300" : "text-blue-700";
  const infoBg = isDark ? "bg-blue-900/40" : "bg-blue-200";

  return (
    <View className={`flex-row items-center ${infoBg} p-3 rounded-lg w-full`}>
      <Feather name="info" size={15} color={infoIconColor} />
      <Text className={`${infoText} ml-2`}>
        Area hijau pada peta menunjukkan zona presensi.
      </Text>
    </View>
  );
};

export default MapInfo;
