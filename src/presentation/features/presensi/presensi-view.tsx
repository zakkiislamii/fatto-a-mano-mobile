import { StatusPresensi } from "@/src/common/enums/status-presensi";
import Button from "@/src/components/ui/button";
import React from "react";
import { Text, View } from "react-native";
import useLiveLocation from "../maps/hooks/use-live-location";
import MapsView from "../maps/maps-view";
import useWifi from "../wifi/hooks/use-wifi";
import LocationStatus from "./components/location-status";
import MapInfo from "./components/map-info";
import WifiStatus from "./components/wifi-status";
import useAddPresensiMasuk from "./hooks/presensi/presensi-masuk/use-add-presensi-masuk";
import useGetPresensiToday from "./hooks/use-get-presensi-today";

interface PresensiViewProps {
  isDark: boolean;
  uid: string;
}

const PresensiView = ({ isDark, uid }: PresensiViewProps) => {
  const { isWifiConnected, isBssid, wifiLoading } = useWifi();
  const { canCheck } = useLiveLocation();
  const { handlePresensiMasuk, loading, isButtonDisabled } =
    useAddPresensiMasuk(uid);
  const { presensiStatus, loading: statusLoading } = useGetPresensiToday(uid);

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
  const testKeluar = () => {
    console.log("keluar");
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
        onPress={() =>
          presensiStatus.sudah_masuk ? testKeluar() : handlePresensiMasuk()
        }
        loading={loading}
        disabled={isButtonDisabled}
        className={`py-4 w-full rounded-xl ${buttonBg} mt-auto`}
        textClassName={`font-bold text-lg ${primaryText}`}
      />
    </View>
  );
};

export default PresensiView;
