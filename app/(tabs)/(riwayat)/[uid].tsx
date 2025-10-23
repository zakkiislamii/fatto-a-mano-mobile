import RiwayatView from "@/src/presentation/views/riwayat/riwayat-view";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function RiwayatKaryawanRoute() {
  const params = useLocalSearchParams<{ uid: string }>();
  return <RiwayatView uid={params.uid} />;
}
