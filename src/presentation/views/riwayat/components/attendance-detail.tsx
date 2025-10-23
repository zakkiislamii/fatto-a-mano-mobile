import { DynamicBottomSheet } from "@/src/components/ui/dynamic-bottom-sheet";
import InfoRow from "@/src/components/ui/info-row";
import { Presensi } from "@/src/domain/models/presensi";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

// Fungsi formatDate (tidak berubah)
const formatDate = (date: Date, format: "full" | "day"): string => {
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const day = days[date.getDay()];
  const dateNum = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  if (format === "full") {
    return `${day}, ${dateNum} ${month} ${year}`;
  }
  return `${day}, ${dateNum} ${month}`;
};

export const AttendanceDetail = ({
  selectedDate,
  selectedPresensi,
  isDark,
}: {
  selectedDate: Date;
  selectedPresensi: Presensi | null;
  isDark: boolean;
}) => {
  // --- PERBAIKAN: Menggunakan state tunggal untuk menampilkan bukti ---
  const [evidence, setEvidence] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const textPrimary = isDark ? "text-textPrimaryDark" : "text-textPrimaryLight";
  const textSecondary = isDark
    ? "text-textSecondaryDark"
    : "text-textSecondaryLight";
  const cardBg = isDark ? "bg-cardDark" : "bg-cardLight";
  const separator = isDark ? "border-slate-700" : "border-slate-200";
  const successColor = isDark ? "#22c55e" : "#16a34a";
  const warningColor = isDark ? "#f97316" : "#ea580c";
  const infoColor = isDark ? "#3b82f6" : "#2563eb"; // Diperbarui untuk konsistensi

  if (!selectedPresensi) {
    return (
      <View
        className={`${cardBg} flex-1 mx-5 my-4 items-center justify-center rounded-xl p-6 shadow-sm border ${separator}`}
      >
        <Feather
          name="calendar"
          size={40}
          color={isDark ? "#4b5563" : "#9ca3af"}
        />
        <Text className={`text-center mt-4 ${textSecondary}`}>
          Tidak ada data presensi untuk tanggal{" "}
          {formatDate(selectedDate, "full")}
        </Text>
      </View>
    );
  }

  const displayStatus =
    selectedPresensi.status?.toLowerCase() === "hadir" &&
    selectedPresensi.presensi_masuk.terlambat
      ? "Terlambat"
      : selectedPresensi.status;

  const getStatusColor = () => {
    switch (displayStatus?.toLowerCase()) {
      case "hadir":
        return successColor;
      case "terlambat":
        return warningColor;
      case "sakit":
        return isDark ? "#ef4444" : "#dc2626";
      case "izin":
        return infoColor; // Menggunakan infoColor yang sudah didefinisi
      default:
        return isDark ? "#6b7280" : "#4b5563";
    }
  };

  const checkInTime = selectedPresensi.presensi_masuk.waktu || "-";
  const checkOutTime = selectedPresensi.presensi_keluar.waktu || "-";
  const hasOvertime = selectedPresensi.presensi_keluar.lembur;
  const overtimeDuration = selectedPresensi.presensi_keluar.durasi_lembur;
  const keluarLebihAwal = selectedPresensi.presensi_keluar.keluar_awal;
  const alasanKeluarAwal = selectedPresensi.presensi_keluar.alasan_keluar_awal;
  const buktiKeluarAwalUrl = selectedPresensi.presensi_keluar.bukti_keluar_awal;

  return (
    <>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View
          className={`${cardBg} mx-5 rounded-xl p-5 shadow-sm border ${separator}`}
        >
          {/* Bagian Header (Tanggal & Status) */}
          <View className="flex-row justify-between items-center mb-5">
            <Text className={`font-bold text-lg ${textPrimary}`}>
              {formatDate(selectedDate, "day")}
            </Text>
            <View
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: `${getStatusColor()}20` }}
            >
              <Text
                className="font-semibold text-xs capitalize"
                style={{ color: getStatusColor() }}
              >
                {displayStatus}
              </Text>
            </View>
          </View>

          {/* Bagian Waktu Masuk & Keluar */}
          <View className="flex-row gap-6">
            <View className="flex-1">
              <View className="flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-full bg-blue-500/20 items-center justify-center">
                  <Feather name="log-in" size={16} color="#3b82f6" />
                </View>
                <View className="flex-1">
                  <Text className={`text-xs ${textSecondary}`}>
                    Waktu Masuk
                  </Text>
                  <Text className={`text-2xl font-bold ${textPrimary}`}>
                    {checkInTime}
                  </Text>
                </View>
              </View>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-full bg-green-500/20 items-center justify-center">
                  <Feather name="log-out" size={16} color="#22c55e" />
                </View>
                <View className="flex-1">
                  <Text className={`text-xs ${textSecondary}`}>
                    Waktu Keluar
                  </Text>
                  <Text className={`text-2xl font-bold ${textPrimary}`}>
                    {checkOutTime}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* --- PERBAIKAN: Kartu Rincian Presensi --- */}
        <View
          className={`${cardBg} mx-5 mt-4 rounded-xl p-5 shadow-sm border ${separator}`}
        >
          <Text className={`font-bold mb-4 ${textPrimary}`}>
            Rincian Presensi
          </Text>
          <View className="gap-4">
            <InfoRow
              icon="map-pin"
              label="Lokasi"
              value="Di Kantor" // Asumsi hardcode
              isDark={isDark}
            />
            {selectedPresensi.presensi_masuk.terlambat && (
              <InfoRow
                icon="clock"
                label="Terlambat"
                value={selectedPresensi.presensi_masuk.durasi_terlambat || "-"}
                isDark={isDark}
                color={warningColor}
              />
            )}
            {keluarLebihAwal && (
              <View className="justify-center items-center gap-3">
                <InfoRow
                  icon="alert-circle"
                  label="Keluar Awal"
                  value={alasanKeluarAwal || "-"}
                  isDark={isDark}
                  color={infoColor}
                />
                {buktiKeluarAwalUrl && (
                  <TouchableOpacity
                    onPress={() =>
                      setEvidence({
                        url: buktiKeluarAwalUrl,
                        title: "Bukti Keluar Awal",
                      })
                    }
                    className="pl-1"
                  >
                    <Text
                      className={`text-sm font-medium underline`}
                      style={{ color: infoColor }}
                    >
                      Lihat Bukti Keluar Awal
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>

        {hasOvertime && (
          <View
            className={`${cardBg} mx-5 mt-4 rounded-xl p-5 shadow-sm border ${separator}`}
          >
            <View className="flex-row items-center mb-3">
              <Feather name="moon" size={20} color={successColor} />
              <Text
                className={`text-lg font-bold ml-2`}
                style={{ color: successColor }}
              >
                Lembur
              </Text>
            </View>
            <Text className={`text-2xl font-bold mb-1 ${textPrimary}`}>
              {overtimeDuration || "-"}
            </Text>
          </View>
        )}
      </ScrollView>

      <DynamicBottomSheet
        isVisible={!!evidence}
        title={evidence?.title || "Bukti"}
        onClose={() => setEvidence(null)}
        secondaryButtonText="Tutup"
        onSecondaryButtonPress={() => setEvidence(null)}
        isDark={isDark}
        customContent={
          <View className="items-center">
            {evidence?.url ? (
              <Image
                source={{ uri: evidence.url }}
                className="w-full h-64 rounded-lg"
                resizeMode="contain"
              />
            ) : (
              <Text className={textSecondary}>Gambar tidak tersedia.</Text>
            )}
          </View>
        }
      />
    </>
  );
};
