// src/presentation/features/wifi/hooks/use-wifi.ts
import { ALLOWED_BSSIDS } from "@/src/common/constants/constants";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

const useWifi = () => {
  const [isWifiConnected, setIsWifiConnected] = useState<boolean>(false);
  const [isBssid, setIsBssid] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [wifiLoading, setWifiLoading] = useState<boolean>(true);
  const [networkLoading, setNetworkLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const fetchInfo = async () => {
      try {
        setNetworkLoading(true);
        const netState = await NetInfo.fetch();
        if (!mounted) return;
        setIsOnline(Boolean(netState.isConnected ?? false));
      } catch {
        if (mounted) setIsOnline(false);
      } finally {
        if (mounted) setNetworkLoading(false);
      }

      try {
        setWifiLoading(true);
        const state = await NetInfo.fetch();
        if (!mounted) return;

        if (state.type === "wifi" && state.details) {
          const wifi = state.details as any;
          const bssid = wifi?.bssid?.toString?.().toLowerCase?.() ?? "";
          const match = ALLOWED_BSSIDS.some(
            (allowed) => allowed.toLowerCase() === bssid
          );

          setIsWifiConnected(
            Boolean(state.isConnected === true && state.type === "wifi")
          );
          setIsBssid(match);
        } else {
          setIsWifiConnected(false);
          setIsBssid(false);
        }
      } catch (error) {
        console.error("Gagal memeriksa koneksi WiFi:", error);
        setIsWifiConnected(false);
        setIsBssid(false);
      } finally {
        if (mounted) setWifiLoading(false);
      }
    };

    fetchInfo();

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(Boolean(state.isConnected ?? false));
      if (state.type === "wifi" && state.details) {
        const wifi = state.details as any;
        const bssid = wifi?.bssid?.toString?.().toLowerCase?.() ?? "";
        const match = ALLOWED_BSSIDS.some(
          (allowed) => allowed.toLowerCase() === bssid
        );
        setIsWifiConnected(
          Boolean(state.isConnected === true && state.type === "wifi")
        );
        setIsBssid(match);
      } else {
        setIsWifiConnected(false);
        setIsBssid(false);
      }
      setNetworkLoading(false);
      setWifiLoading(false);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return {
    isWifiConnected,
    isBssid,
    wifiLoading,
    isOnline,
    networkLoading,
  };
};

export default useWifi;
