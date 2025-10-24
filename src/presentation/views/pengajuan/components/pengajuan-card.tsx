import { StatusPengajuan } from "@/src/common/enums/status-pengajuan";
import { DaftarPengajuan } from "@/src/common/types/daftar-pengajuan";
import { AntDesign } from "@expo/vector-icons";
import { Timestamp } from "firebase/firestore";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface PengajuanCardProps {
  item: DaftarPengajuan;
  isDark: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const formatTimestamp = (timestamp: Timestamp) => {
  if (!timestamp) return "N/A";
  return timestamp.toDate().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusBadge = (status: StatusPengajuan) => {
  const baseClasses = "px-3 py-1 rounded-full text-xs font-medium self-start";
  switch (status) {
    case StatusPengajuan.menunggu:
      return `${baseClasses} bg-yellow-500/20 text-yellow-500`;
    case StatusPengajuan.disetujui:
      return `${baseClasses} bg-green-500/20 text-green-500`;
    case StatusPengajuan.ditolak:
      return `${baseClasses} bg-red-500/20 text-red-500`;
    default:
      return `${baseClasses} bg-gray-500/20 text-gray-500`;
  }
};

const PengajuanCard = ({
  item,
  isDark,
  onEdit,
  onDelete,
}: PengajuanCardProps) => {
  const cardBg = isDark ? "bg-cardDark" : "bg-cardLight";
  const textPrimary = isDark ? "text-textPrimaryDark" : "text-textPrimaryLight";
  const textSecondary = isDark
    ? "text-textSecondaryDark"
    : "text-textSecondaryLight";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";
  const iconColor = isDark ? "#9ca3af" : "#6b7280";

  return (
    <View className={`rounded-lg p-4 border ${borderColor} ${cardBg} mb-3`}>
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className={`text-lg font-bold ${textPrimary} mb-1`}>
            Pengajuan {capitalize(item.tipe)}
          </Text>
          <Text className={`text-sm ${textSecondary} mb-2`}>
            Tanggal: {item.tanggal_pengajuan}
          </Text>
        </View>
        <Text className={getStatusBadge(item.status)}>
          {capitalize(item.status)}
        </Text>
      </View>

      <Text className={`text-xs ${textSecondary} opacity-80 mb-3`}>
        Terakhir update: {formatTimestamp(item.updated_at)}
      </Text>

      <View
        className={`flex-row justify-end gap-3 border-t ${borderColor} pt-3`}
      >
        <TouchableOpacity
          onPress={onEdit}
          className="flex-row items-center gap-1 px-3 py-2 rounded-lg bg-blue-500/10"
        >
          <AntDesign
            name="edit"
            size={16}
            color={isDark ? "#60a5fa" : "#3b82f6"}
          />
          <Text className="text-sm font-medium text-blue-500">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onDelete}
          className="flex-row items-center gap-1 px-3 py-2 rounded-lg bg-red-500/10"
        >
          <AntDesign
            name="delete"
            size={16}
            color={isDark ? "#f87171" : "#ef4444"}
          />
          <Text className="text-sm font-medium text-red-500">Hapus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PengajuanCard;
