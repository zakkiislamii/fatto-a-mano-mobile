import { StatusPengajuan } from "@/src/common/enums/status-pengajuan";
import React from "react";
import { Text, View } from "react-native";

const StatusBadge = ({
  status,
  isDark,
}: {
  status: StatusPengajuan;
  isDark: boolean;
}) => {
  let bgColor, textColor;

  switch (status) {
    case StatusPengajuan.menunggu:
      bgColor = isDark ? "bg-info-dark-bg" : "bg-info-light-bg";
      textColor = isDark ? "text-info-dark" : "text-info-light";
      break;
    case StatusPengajuan.disetujui:
      bgColor = isDark ? "bg-success-dark-bg" : "bg-success-light-bg";
      textColor = isDark ? "text-success-dark" : "text-success-light";
      break;
    case StatusPengajuan.ditolak:
      bgColor = isDark ? "bg-danger-dark-bg" : "bg-danger-light-bg";
      textColor = isDark ? "text-danger-dark" : "text-danger-light";
      break;
  }

  return (
    <View className={`px-3 py-1 rounded-full self-start ${bgColor} shadow-sm`}>
      <Text className={`font-semibold text-xs capitalize ${textColor}`}>
        {status}
      </Text>
    </View>
  );
};

export default StatusBadge;
