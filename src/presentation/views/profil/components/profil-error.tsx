import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface Props {
  error: string;
  isDark: boolean;
  textColor: string;
  secondaryTextColor: string;
  cardBg: string;
}

const ProfilError = ({
  error,
  textColor,
  secondaryTextColor,
  cardBg,
}: Props) => {
  return (
    <View className={`${cardBg} rounded-xl p-6 items-center`}>
      <Feather name="x-circle" size={40} color="#F87171" />
      <Text className={`text-lg ${textColor} font-bold mt-4`}>
        Gagal Memuat Profil
      </Text>
      <Text className={`text-sm ${secondaryTextColor} mt-1 text-center`}>
        {error}
      </Text>
    </View>
  );
};

export default ProfilError;
