import { Karyawan } from "@/src/domain/models/karyawan";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

const ProfilDetailContent = ({
  karyawan,
  isDark,
}: {
  karyawan: Karyawan;
  isDark: boolean;
}) => {
  const textPrimary = isDark ? "text-textPrimaryDark" : "text-textPrimaryLight";
  const textSecondary = isDark
    ? "text-textSecondaryDark"
    : "text-textSecondaryLight";
  const iconColor = isDark ? "#d1d5db" : "#64748b";

  return (
    <View className="gap-y-4 px-1 pb-2">
      {/* Nama */}
      <View className="flex-row items-center">
        <Feather name="user" size={18} color={iconColor} />
        <View className="ml-3 flex-1 gap-0.5">
          <Text className={`text-sm ${textSecondary}`}>Nama</Text>
          <Text className={`text-base font-semibold ${textPrimary}`}>
            {karyawan.nama || "-"}
          </Text>
        </View>
      </View>

      {/* Email */}
      <View className="flex-row items-center">
        <Feather name="mail" size={18} color={iconColor} />
        <View className="ml-3 flex-1 gap-0.5">
          <Text className={`text-sm ${textSecondary}`}>Email</Text>
          <Text className={`text-base font-semibold ${textPrimary}`}>
            {karyawan.email || "-"}
          </Text>
        </View>
      </View>

      {/* Divisi */}
      <View className="flex-row items-center">
        <Feather name="briefcase" size={18} color={iconColor} />
        <View className="ml-3 flex-1 gap-0.5">
          <Text className={`text-sm ${textSecondary}`}>Divisi</Text>
          <Text className={`text-base font-semibold ${textPrimary}`}>
            {karyawan.divisi || "-"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ProfilDetailContent;
