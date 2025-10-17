import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useEffect } from "react";

const useGoogleSignin = () => {
  useEffect(() => {
    const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

    if (!webClientId) {
      console.warn(
        "[GoogleSignin] Missing EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID. " +
          "Pastikan sudah mengisi .env dan rebuild app."
      );
      return;
    }

    GoogleSignin.configure({
      webClientId,
      offlineAccess: false,
      forceCodeForRefreshToken: false,
    });
  }, []);
};

export default useGoogleSignin;
