import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface LocationStatusProps {
  canCheck: boolean;
  isDark: boolean;
}

const LocationStatus = ({ canCheck, isDark }: LocationStatusProps) => {
  const warningBg = isDark ? "bg-yellow-900/40" : "bg-yellow-200";
  const warningIconColor = isDark ? "#facc15" : "#f59e0b";
  const warningText = isDark ? "text-yellow-300" : "text-yellow-700";
  const successBg = isDark ? "bg-green-900/40" : "bg-green-200";
  const successIconColor = isDark ? "#4ade80" : "#16a34a";
  const successText = isDark ? "text-green-300" : "text-green-700";
  if (canCheck) {
    return (
      <View
        className={`flex-row items-center p-3 rounded-lg ${successBg} w-full`}
      >
        <Feather name="map-pin" size={20} color={successIconColor} />
        <Text className={`ml-3 font-medium ${successText}`}>
          Lokasi Anda valid (di dalam area kantor).
        </Text>
      </View>
    );
  }

  // Jika tidak di dalam kantor
  return (
    <View
      className={`flex-row items-center p-3 rounded-lg ${warningBg} w-full`}
    >
      <Feather
        name="alert-triangle"
        size={20}
        color={warningIconColor}
        className="mr-3"
      />
      <Text className={`font-medium ${warningText}`}>
        Anda berada di luar area kantor.
      </Text>
    </View>
  );
};

export default LocationStatus;
