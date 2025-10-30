import { ALLOWED_BSSIDS } from "@/src/common/constants/constants";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useRef, useState } from "react";

const useWifi = () => {
  const [isWifiConnected, setIsWifiConnected] = useState<boolean>(false);
  const [isBssid, setIsBssid] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [wifiLoading, setWifiLoading] = useState<boolean>(true);
  const [networkLoading, setNetworkLoading] = useState<boolean>(true);
  const mountedRef = useRef(true);

  const checkWifi = async () => {
    if (!mountedRef.current) return;

    try {
      setNetworkLoading(true);
      const netState = await NetInfo.fetch();
      if (!mountedRef.current) return;
      setIsOnline(Boolean(netState.isConnected ?? false));
    } catch {
      if (mountedRef.current) setIsOnline(false);
    } finally {
      if (mountedRef.current) setNetworkLoading(false);
    }

    try {
      setWifiLoading(true);
      const state = await NetInfo.fetch();
      if (!mountedRef.current) return;

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
      if (mountedRef.current) setWifiLoading(false);
    }
  };

  const refreshWifi = async () => {
    await checkWifi();
  };

  useEffect(() => {
    mountedRef.current = true;
    checkWifi();

    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!mountedRef.current) return;

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
      mountedRef.current = false;
      unsubscribe();
    };
  }, []);

  return {
    isWifiConnected,
    isBssid,
    wifiLoading,
    isOnline,
    networkLoading,
    refreshWifi,
  };
};

export default useWifi;
