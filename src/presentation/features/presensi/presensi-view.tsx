import { StatusPresensi } from "@/src/common/enums/status-presensi";
import Button from "@/src/components/ui/button";
import { DynamicBottomSheet } from "@/src/components/ui/dynamic-bottom-sheet";
import { DynamicModal } from "@/src/components/ui/dynamic-modal";
import React from "react";
import { Text, View } from "react-native";
import useLiveLocation from "../maps/hooks/use-live-location";
import MapsView from "../maps/maps-view";
import useWifi from "../wifi/hooks/use-wifi";
import LocationStatus from "./components/location-status";
import MapInfo from "./components/map-info";
import WifiStatus from "./components/wifi-status";
import FormKeluarAwal from "./hooks/presensi/presensi-keluar/components/form-keluar-awal";
import useAddPresensiKeluar from "./hooks/presensi/presensi-keluar/use-add-presensi-keluar";
import useAddPresensiMasuk from "./hooks/presensi/presensi-masuk/use-add-presensi-masuk";
import useGetPresensiToday from "./hooks/use-get-presensi-today";

interface PresensiViewProps {
  isDark: boolean;
  uid: string;
}

const PresensiView = ({ isDark, uid }: PresensiViewProps) => {
  const { isWifiConnected, isBssid, wifiLoading } = useWifi();
  const { canCheck } = useLiveLocation();
  const {
    handlePresensiMasuk,
    loading: presensiMasukLoading,
    isButtonDisabled: presensiMasukButtonDisabled,
  } = useAddPresensiMasuk(uid);
  const { presensiStatus, loading: statusLoading } = useGetPresensiToday(uid);

  const {
    handlePresensiKeluar,
    loading: presensiKeluarLoading,
    isButtonDisabled: presensiKeluarButtonDisabled,
    showBottomSheet,
    showModal,
    showLemburSheet,
    closeEvidenceModal,
    closeModal,
    closeLemburSheet,
    control,
    errors,
    canSubmit,
    handlePickEvidence,
    handleSubmitKeluarAwal,
    buktiKeluarAwal,
    handleKeluarBiasa,
    handleAjukanLembur,
    prosesPresensiKeluarLembur,
    lemburDurasiMenit,
  } = useAddPresensiKeluar(uid);

  const bgColor = isDark ? "bg-cardDark" : "bg-cardLight";
  const buttonBg = isDark ? "bg-button-dark" : "bg-button-light";
  const primaryText = isDark ? "text-textPrimaryDark" : "text-textPrimaryLight";
  const textSecondary = isDark
    ? "text-textSecondaryDark"
    : "text-textSecondaryLight";

  const getStatusDisplay = () => {
    const status = presensiStatus.status;
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
  const buttonTitle = presensiStatus.sudah_masuk ? "Keluar" : "Masuk";
  const title = presensiStatus.sudah_masuk
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
      {!statusLoading && presensiStatus.sudah_masuk && (
        <View className="w-full bg-opacity-10 mb-3 p-3 border rounded-2xl">
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
              {presensiStatus.terlambat && presensiStatus.durasi_terlambat && (
                <Text className={`text-sm ${textSecondary}`}>
                  Terlambat: {presensiStatus.durasi_terlambat}
                </Text>
              )}
            </View>
          </View>
        </View>
      )}
      <MapsView isDark={isDark} />

      <View className="w-full gap-3 mb-3">
        <WifiStatus
          wifiLoading={wifiLoading}
          isWifiConnected={isWifiConnected}
          isBssid={isBssid}
          isDark={isDark}
        />
        <LocationStatus canCheck={canCheck} isDark={isDark} />
        <MapInfo isDark={isDark} />
      </View>

      <Button
        title={buttonTitle}
        onPress={
          presensiStatus.sudah_masuk
            ? handlePresensiKeluar
            : handlePresensiMasuk
        }
        loading={
          presensiStatus.sudah_masuk
            ? presensiKeluarLoading
            : presensiMasukLoading
        }
        disabled={
          presensiStatus.sudah_masuk
            ? presensiKeluarButtonDisabled
            : presensiMasukButtonDisabled
        }
        className={`py-4 w-full rounded-xl ${buttonBg} mt-auto`}
        textClassName={`font-bold text-lg ${primaryText}`}
      />

      <DynamicBottomSheet
        isVisible={showBottomSheet}
        onClose={closeEvidenceModal}
        title="Keluar Lebih Awal"
        isDark={isDark}
        customContent={
          <FormKeluarAwal
            control={control}
            errors={errors}
            handlePickEvidence={handlePickEvidence}
            buktiKeluarAwal={buktiKeluarAwal}
            isDark={isDark}
            onSubmit={handleSubmitKeluarAwal}
            canSubmit={canSubmit}
            loading={presensiKeluarLoading}
            buttonBg={buttonBg}
            primaryText={primaryText}
          />
        }
      />

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

      <DynamicBottomSheet
        isVisible={showLemburSheet}
        onClose={closeLemburSheet}
        title="Konfirmasi Lembur"
        isDark={isDark}
        customContent={
          <View className="gap-4">
            <Text className={textSecondary}>
              Anda akan mengajukan lembur selama:
            </Text>
            <Text
              className={`text-3xl font-bold text-center my-2 ${primaryText}`}
            >
              {lemburDurasiMenit ?? 0} menit
            </Text>
            <Button
              title="Konfirmasi & Keluar"
              onPress={() => prosesPresensiKeluarLembur(lemburDurasiMenit ?? 0)}
              loading={presensiKeluarLoading}
              disabled={presensiKeluarLoading}
              className={`py-4 w-full rounded-xl ${buttonBg} mt-4`}
              textClassName={`font-bold text-lg ${primaryText}`}
            />
          </View>
        }
      />
    </View>
  );
};

export default PresensiView;
