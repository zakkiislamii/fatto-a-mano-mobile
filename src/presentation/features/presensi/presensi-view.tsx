import Button from "@/src/components/ui/button";
import React from "react";
import { Text, View } from "react-native";
import useAddPresensiMasuk from "../../hooks/presensi/presensi-masuk/use-add-presensi-masuk";
import useLiveLocation from "../maps/hooks/use-live-location";
import MapsView from "../maps/maps-view";
import useWifi from "../wifi/hooks/use-wifi";
import LocationStatus from "./components/location-status";
import MapInfo from "./components/map-info";
import WifiStatus from "./components/wifi-status";

interface PresensiViewProps {
  isDark: boolean;
  uid: string;
}

const PresensiView = ({ isDark, uid }: PresensiViewProps) => {
  const { isWifiConnected, isBssid, wifiLoading } = useWifi();
  console.log(isWifiConnected);
  const { canCheck } = useLiveLocation();
  const { handlePresensiMasuk, loading, isButtonDisabled } =
    useAddPresensiMasuk(uid);
  const bgColor = isDark ? "bg-cardDark" : "bg-cardLight";
  const buttonBg = isDark ? "bg-button-dark" : "bg-button-light";
  const primaryText = isDark ? "text-textPrimaryDark" : "text-textPrimaryLight";
  const textSecondary = isDark
    ? "text-textSecondaryDark"
    : "text-textSecondaryLight";

  return (
    <View className={`p-6 w-full shadow-md items-center ${bgColor}`}>
      <Text className={`text-2xl font-bold mb-2 ${primaryText}`}>
        Presensi Masuk
      </Text>
      <Text className={`mb-5 text-sm text-center ${textSecondary}`}>
        Pastikan Anda terhubung ke jaringan WiFi dan berada di lokasi kantor
        untuk melakukan presensi.
      </Text>

      <MapsView isDark={isDark} />

      <View className="w-full gap-3 mb-5">
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
        title="Masuk"
        onPress={handlePresensiMasuk}
        loading={loading}
        disabled={isButtonDisabled}
        className={`py-4 w-full rounded-xl ${buttonBg} mt-auto`}
        textClassName={`font-bold text-lg ${primaryText}`}
      />
    </View>
  );
};

export default PresensiView;
