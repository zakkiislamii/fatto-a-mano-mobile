import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

const ProfilLoading = ({
  isDark,
  secondaryTextColor,
}: {
  isDark: boolean;
  secondaryTextColor: string;
}) => {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color={isDark ? "#FFFFFF" : "#4B5563"} />
      <Text className={`mt-4 text-base ${secondaryTextColor}`}>
        Memuat profil...
      </Text>
    </View>
  );
};

export default ProfilLoading;
