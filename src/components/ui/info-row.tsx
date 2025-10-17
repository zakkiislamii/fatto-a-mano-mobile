import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

const InfoRow = ({
  icon,
  label,
  value,
  isDark,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string | null | undefined;
  isDark: boolean;
}) => {
  if (!value) return null;

  const textColor = isDark ? "text-textPrimaryDark" : "text-textPrimaryLight";
  const secondaryTextColor = isDark
    ? "text-textSecondaryDark"
    : "text-textSecondaryLight";
  const iconColor = isDark ? "#A0A0A0" : "#6B7280";

  return (
    <View className="flex-row items-center">
      <Feather name={icon} size={20} color={iconColor} />
      <View className="ml-4 flex-1">
        <Text className={`text-xs ${secondaryTextColor}`}>{label}</Text>
        <Text className={`text-base font-semibold ${textColor}`}>{value}</Text>
      </View>
    </View>
  );
};

export default InfoRow;
