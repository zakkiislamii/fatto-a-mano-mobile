import { JadwalKaryawan } from "@/src/domain/models/jadwal-karyawan";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

const JadwalDetailContent = ({
  jadwal,
  isDark,
}: {
  jadwal: JadwalKaryawan;
  isDark: boolean;
}) => {
  const textPrimary = isDark ? "text-textPrimaryDark" : "text-textPrimaryLight";
  const textSecondary = isDark
    ? "text-textSecondaryDark"
    : "text-textSecondaryLight";
  const iconColor = isDark ? "#d1d5db" : "#64748b";

  const isWFA = jadwal.is_wfa;
  const statusBg = isWFA
    ? isDark
      ? "bg-info-dark-bg"
      : "bg-info-light-bg"
    : isDark
      ? "bg-neutral-dark-bg"
      : "bg-neutral-light-bg";
  const statusText = isWFA
    ? isDark
      ? "text-info-dark"
      : "text-info-light"
    : isDark
      ? "text-neutral-dark"
      : "text-neutral-light";

  return (
    <View className="gap-y-4 px-1 pb-2">
      {/* Badge Status */}
      <View className={`self-start px-3 py-1 rounded-full ${statusBg}`}>
        <Text className={`font-semibold text-sm ${statusText}`}>
          {isWFA ? "Work From Anywhere" : "Work From Office"}
        </Text>
      </View>

      {/* Jam Kerja */}
      <View className="flex-row items-center">
        <Feather name="clock" size={18} color={iconColor} />
        <View className="ml-3 flex-1 gap-0.5">
          <Text className={`text-sm ${textSecondary}`}>Jam Kerja</Text>
          <Text className={`text-base font-semibold ${textPrimary}`}>
            {jadwal.jam_masuk} - {jadwal.jam_keluar}
          </Text>
        </View>
      </View>

      {/* Hari Kerja */}
      <View className="flex-row items-center">
        <Feather name="calendar" size={18} color={iconColor} />
        <View className="ml-3 flex-1 gap-0.5">
          <Text className={`text-sm ${textSecondary}`}>Hari Kerja</Text>
          <Text className={`text-base font-semibold ${textPrimary}`}>
            {jadwal.hari_kerja}
          </Text>
        </View>
      </View>
    </View>
  );
};
export default JadwalDetailContent;
