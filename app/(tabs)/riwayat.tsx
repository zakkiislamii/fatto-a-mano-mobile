import { useFirebaseAuth } from "@/src/hooks/use-auth";
import RiwayatView from "@/src/presentation/views/riwayat/riwayat-view";
import React from "react";

export default function RiwayatRoute() {
  const { uid } = useFirebaseAuth();
  return <RiwayatView uid={uid} />;
}
