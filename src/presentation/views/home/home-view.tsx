import { useFirebaseAuth } from "@/src/hooks/use-auth";
import React from "react";
import { Text, useColorScheme } from "react-native";
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
      <SafeAreaView className={`flex-1 ${screenBg}`}>
        <Text>Loading...</Text>
      </SafeAreaView>
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
