import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface KaryawanActionButtonsProps {
  isDark: boolean;
  borderColor: string;
  onLihatJadwal: () => void;
  onLihatRiwayat: () => void;
  onLihatDetail: () => void;
}

const KaryawanActionButtons = ({
  isDark,
  borderColor,
  onLihatJadwal,
  onLihatRiwayat,
  onLihatDetail,
}: KaryawanActionButtonsProps) => {
  const primaryBtnBg = isDark ? "bg-button-dark" : "bg-button-light";
  const primaryBtnText = "text-white";
  const riwayatBtnBg = isDark ? "bg-neutral-dark-bg" : "bg-neutral-light-bg";
  const riwayatBtnText = isDark ? "text-neutral-dark" : "text-neutral-light";
  const detailBtnBg = isDark ? "bg-info-dark-bg" : "bg-info-light-bg";
  const detailBtnText = isDark ? "text-info-dark" : "text-info-light";

  return (
    <View className={`flex-row gap-x-2 mt-4 pt-4 border-t ${borderColor}`}>
      {/* Tombol 1: Jadwal */}
      <TouchableOpacity
        onPress={onLihatJadwal}
        className={`${primaryBtnBg} flex-1 py-2.5 rounded-lg items-center`}
      >
        <Text className={`${primaryBtnText} font-semibold text-sm`}>
          Jadwal
        </Text>
      </TouchableOpacity>

      {/* Tombol 2: Riwayat */}
      <TouchableOpacity
        onPress={onLihatRiwayat}
        className={`${riwayatBtnBg} flex-1 py-2.5 rounded-lg items-center`}
      >
        <Text className={`${riwayatBtnText} font-semibold text-sm`}>
          Riwayat
        </Text>
      </TouchableOpacity>

      {/* Tombol 3: Detail */}
      <TouchableOpacity
        onPress={onLihatDetail}
        className={`${detailBtnBg} flex-1 py-2.5 rounded-lg items-center`}
      >
        <Text className={`${detailBtnText} font-semibold text-sm`}>Detail</Text>
      </TouchableOpacity>
    </View>
  );
};

export default KaryawanActionButtons;
