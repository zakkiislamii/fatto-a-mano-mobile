import { StatusPengajuan } from "@/src/common/enums/status-pengajuan";
import formatTimestamp from "@/src/common/utils/format-timestamp";
import { DaftarPengajuan } from "@/src/domain/models/daftar-pengajuan";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface PengajuanCardProps {
  item: DaftarPengajuan;
  isDark: boolean;
  onEdit: (item: DaftarPengajuan) => void;
  onDelete: () => void;
  onViewDetail: () => void;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const getStatusBadge = (status: StatusPengajuan) => {
  const baseClasses = "px-3 py-1 rounded-full text-xs font-medium self-start";
  switch (status) {
    case StatusPengajuan.MENUNGGU:
      return `${baseClasses} bg-yellow-500/20 text-yellow-500`;
    case StatusPengajuan.DISETUJUI:
      return `${baseClasses} bg-green-500/20 text-green-500`;
    case StatusPengajuan.DITOLAK:
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
  onViewDetail,
}: PengajuanCardProps) => {
  const cardBg = isDark ? "bg-cardDark" : "bg-cardLight";
  const textPrimary = isDark ? "text-textPrimaryDark" : "text-textPrimaryLight";
  const textSecondary = isDark
    ? "text-textSecondaryDark"
    : "text-textSecondaryLight";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";
  const pengajuanDisetujui =
    item.status === StatusPengajuan.DISETUJUI ||
    item.status === StatusPengajuan.DITOLAK;

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
          onPress={onViewDetail}
          className="flex-row items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/10"
        >
          <AntDesign
            name="eye"
            size={18}
            color={isDark ? "#c084fc" : "#9333ea"}
          />
          <Text className="text-sm font-medium text-purple-500">Detail</Text>
        </TouchableOpacity>
        {!pengajuanDisetujui && (
          <>
            <TouchableOpacity
              onPress={() => onEdit(item)}
              className="flex-row items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10"
            >
              <AntDesign
                name="edit"
                size={18}
                color={isDark ? "#60a5fa" : "#3b82f6"}
              />
              <Text className="text-sm font-medium text-blue-500">Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onDelete}
              className="flex-row items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10"
            >
              <AntDesign
                name="delete"
                size={18}
                color={isDark ? "#f87171" : "#ef4444"}
              />
              <Text className="text-sm font-medium text-red-500">Hapus</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default PengajuanCard;
