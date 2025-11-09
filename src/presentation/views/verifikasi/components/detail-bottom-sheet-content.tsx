import { TipePengajuan } from "@/src/common/enums/tipe-pengajuan";
import { DetailVerifikasi } from "@/src/domain/models/detail-verifikasi";
import { PengajuanIzin } from "@/src/domain/models/pengajuan-izin";
import { PengajuanLembur } from "@/src/domain/models/pengajuan-lembur";
import { PengajuanSakit } from "@/src/domain/models/pengajuan-sakit";
import { Image } from "expo-image";
import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

const DetailBottomSheetContent = ({
  detail,
  loading,
  error,
  isDark,
}: {
  detail: DetailVerifikasi | null;
  loading: boolean;
  error: string | null;
  isDark: boolean;
}) => {
  const textColor = isDark ? "text-textPrimaryDark" : "text-textPrimaryLight";
  const mutedColor = isDark
    ? "text-textSecondaryDark"
    : "text-textSecondaryLight";
  const labelColor = isDark ? "text-textMutedDark" : "text-textMutedLight";

  if (loading) {
    return (
      <View className="h-48 justify-center items-center">
        <ActivityIndicator
          size="large"
          color={isDark ? "#FFFFFF" : "#888888"}
        />
        <Text className={`mt-3 ${mutedColor}`}>Memuat detail...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="h-48 justify-center items-center">
        <Text className={`text-lg text-danger-light`}>Error: {error}</Text>
      </View>
    );
  }

  if (!detail) {
    return (
      <View className="h-48 justify-center items-center">
        <Text className={`${mutedColor}`}>Data tidak ditemukan.</Text>
      </View>
    );
  }

  const { karyawan, pengajuan } = detail;

  const DetailRow = ({ label, value }: { label: string; value: string }) => (
    <View className="mb-2">
      <Text className={`text-xs capitalize ${labelColor}`}>{label}</Text>
      <Text className={`text-base ${textColor}`}>{value || "-"}</Text>
    </View>
  );

  const BuktiPendukung = ({ uri }: { uri?: string }) => {
    if (!uri) {
      return (
        <View className="mb-2">
          <Text className={`text-xs capitalize ${labelColor}`}>
            Bukti Pendukung
          </Text>
          <Text className={`text-base ${textColor}`}>Tidak ada</Text>
        </View>
      );
    }

    return (
      <View className="mb-2">
        <Text className={`text-xs capitalize ${labelColor} mb-2`}>
          Bukti Pendukung
        </Text>
        <Image
          source={{ uri }}
          style={{
            width: "100%",
            height: 220,
            borderRadius: 8,
          }}
          transition={300}
        />
      </View>
    );
  };

  const getPengajuanDetail = () => {
    if (pengajuan.tipe === TipePengajuan.LEMBUR) {
      return (pengajuan as PengajuanLembur).detail;
    } else if (pengajuan.tipe === TipePengajuan.IZIN) {
      return (pengajuan as PengajuanIzin).detail;
    } else if (pengajuan.tipe === TipePengajuan.SAKIT) {
      return (pengajuan as PengajuanSakit).detail;
    }
    return null;
  };

  const pengajuanDetail = getPengajuanDetail();

  return (
    <ScrollView style={{ maxHeight: 400 }}>
      <View className="mb-4">
        <Text className={`text-lg font-bold mb-2 ${textColor}`}>
          Data Karyawan
        </Text>
        <DetailRow label="Nama" value={karyawan.nama} />
        <DetailRow label="Email" value={karyawan.email} />
        <DetailRow label="Divisi" value={karyawan.divisi} />
      </View>

      <View>
        <Text className={`text-lg font-bold mb-2 ${textColor}`}>
          Data Pengajuan
        </Text>
        <DetailRow label="Tipe" value={pengajuan.tipe} />
        <DetailRow
          label="Tanggal Pengajuan"
          value={pengajuan.tanggal_pengajuan}
        />

        {pengajuan.tipe === TipePengajuan.LEMBUR && pengajuanDetail && (
          <>
            <DetailRow
              label="Durasi Lembur"
              value={
                (pengajuanDetail as PengajuanLembur["detail"]).durasi_lembur
              }
            />
            <DetailRow label="Keterangan" value={pengajuanDetail.keterangan} />
            <BuktiPendukung uri={pengajuanDetail.bukti_pendukung} />
          </>
        )}

        {pengajuan.tipe === TipePengajuan.IZIN && pengajuanDetail && (
          <>
            <DetailRow
              label="Tanggal Mulai"
              value={(pengajuanDetail as PengajuanIzin["detail"]).tanggal_mulai}
            />
            <DetailRow
              label="Tanggal Berakhir"
              value={
                (pengajuanDetail as PengajuanIzin["detail"]).tanggal_berakhir
              }
            />
            <DetailRow label="Keterangan" value={pengajuanDetail.keterangan} />
            <BuktiPendukung uri={pengajuanDetail.bukti_pendukung} />
          </>
        )}

        {pengajuan.tipe === TipePengajuan.SAKIT && pengajuanDetail && (
          <>
            <DetailRow label="Keterangan" value={pengajuanDetail.keterangan} />
            <BuktiPendukung uri={pengajuanDetail.bukti_pendukung} />
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default DetailBottomSheetContent;
