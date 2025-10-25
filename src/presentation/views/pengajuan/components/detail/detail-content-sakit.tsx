import { StatusPengajuan } from "@/src/common/enums/status-pengajuan";
import { PengajuanSakit } from "@/src/common/types/pengajuan_sakit";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const getStatusStyle = (status: StatusPengajuan) => {
  switch (status) {
    case StatusPengajuan.disetujui:
      return {
        container: "bg-green-100 dark:bg-green-900",
        text: "text-green-800 dark:text-green-100",
      };
    case StatusPengajuan.ditolak:
      return {
        container: "bg-red-100 dark:bg-red-900",
        text: "text-red-800 dark:text-red-100",
      };
    case StatusPengajuan.menunggu:
    default:
      return {
        container: "bg-yellow-100 dark:bg-yellow-900",
        text: "text-yellow-800 dark:text-yellow-100",
      };
  }
};

const DetailContentSakit = ({
  detail,
  isDark,
}: {
  detail: PengajuanSakit | null;
  isDark: boolean;
}) => {
  const textPrimary = isDark ? "text-textPrimaryDark" : "text-textPrimaryLight";
  const textSecondary = isDark
    ? "text-textSecondaryDark"
    : "text-textSecondaryLight";
  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const cardBorder = isDark ? "border-gray-700" : "border-gray-200";
  const iconColor = isDark ? "#9CA3AF" : "#6B7281";

  if (!detail) {
    return (
      <View className="p-5 items-center justify-center flex-1">
        <Feather name="alert-circle" size={24} color={iconColor} />
        <Text className={`${textSecondary} mt-2`}>Tidak ada data.</Text>
      </View>
    );
  }

  const d = detail || {};
  const statusStyle = getStatusStyle(d.status);

  return (
    <ScrollView
      contentContainerStyle={{ padding: 5 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-6">
        <View className="flex-row justify-between items-start">
          <Text className={`text-2xl font-bold ${textPrimary} flex-1`}>
            Pengajuan {d.tipe}
          </Text>
          <View
            className={`px-3 py-1 rounded-full ${statusStyle.container} ml-2`}
          >
            <Text
              className={`text-xs font-semibold capitalize ${statusStyle.text}`}
            >
              {d.status}
            </Text>
          </View>
        </View>
        <Text className={`${textSecondary} mt-1 text-sm`}>
          Diajukan pada: {d.tanggal_pengajuan}
        </Text>
      </View>

      <View className={`rounded-lg p-3 ${cardBg} border ${cardBorder} mb-4`}>
        {/* Keterangan */}
        <View className="flex-row items-start mb-5">
          <Feather
            name="file-text"
            size={18}
            color={iconColor}
            className="mr-3 mt-1"
          />
          <View className="flex-1">
            <Text className={`font-medium ${textSecondary}`}>Keterangan</Text>
            <Text className={`${textPrimary} mt-1`}>{d.keterangan ?? "-"}</Text>
          </View>
        </View>
      </View>

      {d.bukti_pendukung ? (
        <View className={`rounded-lg p-3 ${cardBg} border ${cardBorder}`}>
          <View className="flex-row items-center mb-3">
            <Feather
              name="paperclip"
              size={18}
              color={iconColor}
              className="mr-3"
            />
            <Text className={`text-lg font-semibold ${textPrimary}`}>
              Bukti Pendukung
            </Text>
          </View>
          <Image
            source={{ uri: d.bukti_pendukung }}
            style={{
              width: "100%",
              height: 220,
              borderRadius: 8,
            }}
            transition={300}
          />
        </View>
      ) : (
        <View
          className={`rounded-lg p-4 ${cardBg} border ${cardBorder} flex-row items-center`}
        >
          <Feather name="slash" size={18} color={iconColor} className="mr-3" />
          <Text className={`${textSecondary}`}>Tidak ada bukti pendukung.</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default DetailContentSakit;
