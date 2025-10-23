import { useFirebaseAuth } from "@/src/hooks/use-auth";
import React from "react";
import { ActivityIndicator, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import KaryawanView from "./karyawan/karyawan-view";
import ManajerView from "./manajer/manajer-view";

const HomeView = () => {
  const theme = useColorScheme();
  const isDark = theme === "dark";
  const screenBg = isDark ? "bg-screenDark" : "bg-screenLight";
  const { role, uid } = useFirebaseAuth();
  const isManagement = role === "manajer";

  if (!uid) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${screenBg}`}>
      {isManagement ? (
        <ManajerView screenBg={screenBg} isDark={isDark} />
      ) : (
        <KaryawanView screenBg={screenBg} isDark={isDark} uid={uid} />
      )}
    </SafeAreaView>
  );
};
export default HomeView;
