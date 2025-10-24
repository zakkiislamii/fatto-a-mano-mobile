import { StatusPresensi } from "@/src/common/enums/status-presensi";
import Button from "@/src/components/ui/button";
import { DynamicBottomSheet } from "@/src/components/ui/dynamic-bottom-sheet";
import { DynamicModal } from "@/src/components/ui/dynamic-modal";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import useLiveLocation from "../maps/hooks/use-live-location";
import MapsView from "../maps/maps-view";
import useWifi from "../wifi/hooks/use-wifi";
import LocationStatus from "./components/location-status";
import MapInfo from "./components/map-info";
import WifiStatus from "./components/wifi-status";
import FormKeluarAwal from "./hooks/presensi-keluar/components/form-keluar-awal";
import FormLembur from "./hooks/presensi-keluar/components/form-lembur";
import useAddPresensiKeluar from "./hooks/presensi-keluar/hooks/use-add-presensi-keluar";
import useAddPresensiMasuk from "./hooks/presensi-masuk/use-add-presensi-masuk";
import useGetStatusPresensiMasukToday from "./hooks/presensi-masuk/use-get-status-presensi-masuk-today";

interface PresensiViewProps {
  isDark: boolean;
  uid: string;
}

const PresensiView = ({ isDark, uid }: PresensiViewProps) => {
  const { isWifiConnected, isBssid, wifiLoading, refreshWifi } = useWifi();
  const { canCheck } = useLiveLocation();
  const {
    handlePresensiMasuk,
    loading: presensiMasukLoading,
    isButtonDisabled: presensiMasukButtonDisabled,
  } = useAddPresensiMasuk(uid);
  const { presensiMasukStatus, loading: presensiMasukStatusLoading } =
    useGetStatusPresensiMasukToday(uid);
  const {
    handlePresensiKeluar,
    loading: presensiKeluarLoading,
    isButtonDisabled: presensiKeluarButtonDisabled,
    showModal,
    closeModal,
    handleKeluarBiasa,
    handleAjukanLembur,
    keluarLebihAwal,
    lembur,
    presensiKeluarStatus,
    presensiKeluarStatusLoading,
  } = useAddPresensiKeluar(uid);

  const bgColor = isDark ? "bg-cardDark" : "bg-cardLight";
  const buttonBg = isDark ? "bg-button-dark" : "bg-button-light";
  const primaryText = isDark ? "text-textPrimaryDark" : "text-textPrimaryLight";
  const textSecondary = isDark
    ? "text-textSecondaryDark"
    : "text-textSecondaryLight";
  const successBg = isDark ? "bg-green-900/40" : "bg-green-200";
  const successText = isDark ? "text-green-300" : "text-green-700";
  const linkText = isDark ? "text-blue-400" : "text-blue-500";

  const getStatusDisplay = () => {
    const status = presensiMasukStatus.status;
    if (status === StatusPresensi.hadir) {
      return { text: "✓ HADIR", color: "text-green-500" };
    } else if (status === StatusPresensi.terlambat) {
      return { text: "⏱ TERLAMBAT", color: "text-yellow-500" };
    } else if (status === StatusPresensi.alpa) {
      return { text: "✗ ALPA", color: "text-red-500" };
    }
    return { text: "", color: "" };
  };

  const statusDisplay = getStatusDisplay();
  const buttonTitle = presensiMasukStatus.sudah_masuk ? "Keluar" : "Masuk";
  const title = presensiMasukStatus.sudah_masuk
    ? "Presensi Keluar"
    : "Presensi Masuk";

  return (
    <View className={`p-6 w-full shadow-md items-center ${bgColor}`}>
      <Text className={`text-2xl font-bold mb-2 ${primaryText}`}>{title}</Text>
      <Text className={`mb-5 text-sm text-center ${textSecondary}`}>
        Pastikan Anda terhubung ke jaringan WiFi dan berada di lokasi kantor
        untuk melakukan presensi.
      </Text>

      {/* Status Presensi - Tampil setelah presensi masuk */}
      {!presensiMasukStatusLoading && presensiMasukStatus.sudah_masuk && (
        <View className="w-full mb-3 p-3 border rounded-lg">
          <View className="gap-2">
            <Text
              className={`text-lg mb-3 font-semibold text-start ${textSecondary}`}
            >
              Status Presensi Masuk
            </Text>
            <View className="flex-row items-center justify-between">
              <Text className={`text-sm font-bold ${statusDisplay.color}`}>
                {statusDisplay.text}
              </Text>
              {presensiMasukStatus.terlambat &&
                presensiMasukStatus.durasi_terlambat && (
                  <Text className={`text-sm ${textSecondary}`}>
                    Terlambat: {presensiMasukStatus.durasi_terlambat}
                  </Text>
                )}
            </View>
          </View>
        </View>
      )}

      {!presensiKeluarStatusLoading && presensiKeluarStatus.sudah_keluar && (
        <View
          className={`w-full mb-3 p-3 rounded-2xl items-center ${successBg}`}
        >
          <Text
            className={`text-base font-semibold text-center ${successText}`}
          >
            Presensi anda hari ini telah dicatat !
          </Text>

          {presensiKeluarStatus.lembur && (
            <TouchableOpacity
              onPress={() => router.push("/pengajuan")}
              className="mt-2"
            >
              <Text className={`text-sm font-medium underline ${linkText}`}>
                Lihat pengajuan lembur
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <MapsView isDark={isDark} />

      <View className="w-full gap-3 mb-3">
        <MapInfo isDark={isDark} />
        <WifiStatus
          wifiLoading={wifiLoading}
          isWifiConnected={isWifiConnected}
          isBssid={isBssid}
          isDark={isDark}
          onRefresh={refreshWifi}
        />
        <LocationStatus canCheck={canCheck} isDark={isDark} />
      </View>

      <Button
        title={buttonTitle}
        onPress={
          presensiMasukStatus.sudah_masuk
            ? handlePresensiKeluar
            : handlePresensiMasuk
        }
        loading={
          presensiMasukStatus.sudah_masuk
            ? presensiKeluarLoading
            : presensiMasukLoading
        }
        disabled={
          presensiMasukStatus.sudah_masuk
            ? presensiKeluarButtonDisabled
            : presensiMasukButtonDisabled
        }
        className={`py-4 w-full rounded-xl ${buttonBg} mt-auto`}
        textClassName={`font-bold text-lg ${primaryText}`}
      />

      {/* Bottom Sheet: Keluar Awal */}
      <DynamicBottomSheet
        isVisible={keluarLebihAwal.showBottomSheet}
        onClose={keluarLebihAwal.closeBottomSheet}
        title="Keluar Lebih Awal"
        isDark={isDark}
        customContent={
          <FormKeluarAwal
            control={keluarLebihAwal.control}
            errors={keluarLebihAwal.errors}
            handlePickEvidence={keluarLebihAwal.handlePickEvidence}
            buktiKeluarAwal={keluarLebihAwal.buktiKeluarAwal}
            isDark={isDark}
            onSubmit={keluarLebihAwal.handleSubmit}
            canSubmit={keluarLebihAwal.canSubmit}
            loading={keluarLebihAwal.loading}
            buttonBg={buttonBg}
            primaryText={primaryText}
          />
        }
      />

      {/* Modal: Pilihan Keluar Biasa atau Lembur */}
      <DynamicModal
        isVisible={showModal}
        onClose={closeModal}
        title="Presensi Keluar"
        message="Anda keluar lebih dari 30 menit setelah jam kerja. Apakah Anda ingin mengajukan lembur?"
        isDark={isDark}
        primaryButtonText="Ajukan Lembur"
        onPrimaryButtonPress={handleAjukanLembur}
        secondaryButtonText="Keluar Biasa"
        onSecondaryButtonPress={handleKeluarBiasa}
      />

      {/* Bottom Sheet: Form Pengajuan Lembur */}
      <DynamicBottomSheet
        isVisible={lembur.showLemburSheet}
        onClose={lembur.closeLemburSheet}
        title="Pengajuan Lembur"
        isDark={isDark}
        customContent={
          <FormLembur
            control={lembur.control}
            errors={lembur.errors}
            handlePickEvidence={lembur.handlePickEvidence}
            buktiPendukung={lembur.buktiPendukung}
            isDark={isDark}
            onSubmit={lembur.prosesPresensiKeluarLembur}
            canSubmit={lembur.canSubmit}
            loading={lembur.loading}
            buttonBg={buttonBg}
            primaryText={primaryText}
            lemburDurasiMenit={lembur.lemburDurasiMenit}
          />
        }
      />
    </View>
  );
};

export default PresensiView;
