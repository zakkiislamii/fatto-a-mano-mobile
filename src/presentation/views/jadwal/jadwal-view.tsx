import { useFirebaseAuth } from "@/src/hooks/use-auth";
import React from "react";
import { StatusBar, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetJadwal } from "../../hooks/jadwal/use-get-jadwal";
import { WorkScheduleCard } from "./components/work-schedule-card";

const JadwalView = () => {
  const colorScheme = useColorScheme();
  const { uid } = useFirebaseAuth();
  const isDark = colorScheme === "dark";
  const screenBg = isDark ? "bg-screenDark" : "bg-screenLight";
  const barStyleColor = isDark ? "light-content" : "dark-content";
  const textPrimary = isDark ? "text-textPrimaryDark" : "text-textPrimaryLight";
  const textSecondary = isDark
    ? "text-textSecondaryDark"
    : "text-textSecondaryLight";
  const cardBg = isDark ? "bg-cardDark" : "bg-cardLight";
  const textColor = isDark ? "text-textPrimaryDark" : "text-textPrimaryLight";
  const { jadwalKaryawan } = useGetJadwal(uid);

  return (
    <SafeAreaView className={`flex-1 ${screenBg}`}>
      <StatusBar barStyle={barStyleColor} />
      <View className="px-5 pt-5 pb-3 mb-8 flex-row justify-between items-center">
        <View>
          <Text className={`text-3xl font-bold ${textPrimary}`}>
            Jadwal Saya
          </Text>
        </View>
      </View>
      {jadwalKaryawan ? (
        <View className="px-5">
          <WorkScheduleCard
            user={jadwalKaryawan}
            isDark={isDark}
            cardBg={cardBg}
          />
        </View>
      ) : (
        <View className={`${cardBg} rounded-xl p-6 mb-6 shadow-sm`}>
          <Text className={`text-lg font-bold ${textColor} mb-2`}>
            Jadwal Kerja
          </Text>
          <Text className={textSecondary}>Memuat data profil…</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default JadwalView;
