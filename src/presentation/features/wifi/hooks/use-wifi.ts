import { ALLOWED_BSSIDS } from "@/src/common/constants/constants";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

const useWifi = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isBssid, setIsBssid] = useState(false);

  useEffect(() => {
    const fetchWifiInfo = async () => {
      const state = await NetInfo.fetch();

      if (state.type === "wifi" && state.details) {
        const wifi = state.details as any;
        const bssid = wifi?.bssid?.toLowerCase?.() ?? "";
        const match = ALLOWED_BSSIDS.some(
          (allowed) => allowed.toLowerCase() === bssid
        );
        setIsConnected(state.isConnected ?? false);
        setIsBssid(match);
      } else {
        setIsConnected(state.isConnected ?? false);
        setIsBssid(false);
      }
    };

    fetchWifiInfo();
  }, []);

  return { isConnected, isBssid };
};

export default useWifi;
