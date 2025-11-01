import RiwayatView from "@/src/presentation/views/riwayat/riwayat-view";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";

export default function RiwayatDetailRoute() {
  const params = useLocalSearchParams<{ uid: string; nama: string }>();

  return (
    <>
      <Stack.Screen
        options={{
          title: `Riwayat ${params.nama || "Karyawan"}`,
          headerShown: true,
          headerStyle: { backgroundColor: "#2C2C54" },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <RiwayatView uid={params.uid} />
    </>
  );
}
