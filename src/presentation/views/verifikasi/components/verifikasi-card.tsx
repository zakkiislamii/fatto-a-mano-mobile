import { StatusPengajuan } from "@/src/common/enums/status-pengajuan";
import Button from "@/src/components/ui/button";
import { DaftarVerifikasi } from "@/src/domain/models/daftar-verifikasi";
import React from "react";
import { Text, View } from "react-native";
import StatusBadge from "./status-badge";

const VerifikasiCard = ({
  item,
  isDark,
  onDetail,
  onTolak,
  onSetujui,
}: {
  item: DaftarVerifikasi;
  isDark: boolean;
  onDetail: (item: DaftarVerifikasi) => void;
  onTolak: (item: DaftarVerifikasi) => void;
  onSetujui: (item: DaftarVerifikasi) => void;
}) => {
  const cardBg = isDark ? "bg-cardDark" : "bg-cardLight";
  const textColor = isDark ? "text-textPrimaryDark" : "text-textPrimaryLight";
  const mutedColor = isDark
    ? "text-textSecondaryDark"
    : "text-textSecondaryLight";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";

  const setujuiBtnBg = isDark ? "bg-success-dark-bg" : "bg-success-light";
  const tolakBtnBg = isDark ? "bg-danger-dark-bg" : "bg-danger-light";
  const detailBtnBg = isDark ? "bg-info-dark-bg" : "bg-info-light";

  return (
    <View
      className={`rounded-lg p-4 mb-4 border ${borderColor} ${cardBg} shadow-md`}
    >
      {/* Header */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className={`text-lg font-bold ${textColor}`}>{item.nama}</Text>
          <Text className={`text-sm ${mutedColor}`}>{item.divisi}</Text>
        </View>
        <StatusBadge status={item.status} isDark={isDark} />
      </View>

      {/* Body */}
      <View className="mb-4">
        <Text className={`${textColor}`}>
          <Text className="font-semibold">Jenis Pengajuan: </Text>
          <Text className="capitalize">{item.tipe}</Text>
        </Text>
        <Text className={`${mutedColor}`}>
          <Text className="font-semibold">Tanggal Diajukan: </Text>
          {item.tanggal_pengajuan}
        </Text>
      </View>

      {/* Actions */}
      <View className="flex-row justify-end gap-x-2">
        <Button
          title="Detail"
          onPress={() => onDetail(item)}
          className={`${detailBtnBg} rounded-lg py-2 px-4`}
          textClassName="text-white font-bold text-sm"
        />
        {item.status === StatusPengajuan.MENUNGGU && (
          <>
            <Button
              title="Tolak"
              onPress={() => onTolak(item)}
              className={`${tolakBtnBg} rounded-lg py-2 px-4`}
              textClassName="text-white font-bold text-sm"
            />
            <Button
              title="Setujui"
              onPress={() => onSetujui(item)}
              className={`${setujuiBtnBg} rounded-lg py-2 px-4`}
              textClassName="text-white font-bold text-sm"
            />
          </>
        )}
      </View>
    </View>
  );
};

export default VerifikasiCard;
