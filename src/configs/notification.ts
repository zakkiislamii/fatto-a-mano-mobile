import { db } from "@/src/configs/firebase-config";
import {
  AuthorizationStatus,
  FirebaseMessagingTypes,
  getInitialNotification,
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
  requestPermission,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Platform } from "react-native";

function toText(v: unknown, fallback?: string): string | undefined {
  if (typeof v === "string") return v;
  if (v == null) return fallback;
  try {
    const s = JSON.stringify(v);
    return s.length > 120 ? s.slice(0, 117) + "..." : s;
  } catch {
    return fallback;
  }
}

export const configureNotifications = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true as any,
      priority: Notifications.AndroidNotificationPriority.MAX,
    }),
  });

  if (Platform.OS === "android") {
    const messaging = getMessaging();
    setBackgroundMessageHandler(messaging, async (remoteMessage) => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: toText(remoteMessage?.data?.title, "Notifikasi"),
          body: toText(remoteMessage?.data?.body, ""),
          data: remoteMessage?.data ?? {},
          priority: Notifications.AndroidNotificationPriority.MAX,
          sound: true,
        },
        trigger: null,
      });

      const tKirim = parseInt(String(remoteMessage?.data?.tKirim || "0"), 10);
      const tTerima = Date.now();

      addDoc(collection(db, "owdLogs"), {
        feature: remoteMessage.data?.feature,
        tKirim: tKirim,
        tTerima: tTerima,
        owd: tTerima - tKirim,
        appState: "background",
        createdAt: serverTimestamp(),
      }).catch((e) => console.error("[OWD/BG] ERROR:", e));
    });
  }
};

export const requestNotificationPermissions = async () => {
  try {
    const messaging = getMessaging();
    const authStatus = await requestPermission(messaging);
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (!enabled) return false;

    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  } catch (e) {
    console.error("[Notif] Permission error:", e);
    return false;
  }
};

export const ensureAndroidChannel = async () => {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("default", {
    name: "Default",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    showBadge: true,
    enableLights: true,
    enableVibrate: true,
    sound: "default",
  });
};

export const setupNotificationListeners = () => {
  const messaging = getMessaging();

  const unsubForeground = onMessage(
    messaging,
    async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      const title =
        remoteMessage.notification?.title ??
        toText(remoteMessage.data?.title, "Notifikasi");
      const body =
        remoteMessage.notification?.body ??
        toText(remoteMessage.data?.body, "");

      await Notifications.scheduleNotificationAsync({
        content: {
          title: title ?? "Notifikasi",
          body: body ?? "",
          data: remoteMessage.data ?? {},
          priority: Notifications.AndroidNotificationPriority.MAX,
          sound: true,
        },
        trigger: null,
      });

      const tKirim = parseInt(String(remoteMessage?.data?.tKirim || "0"), 10);
      const tTerima = Date.now();

      addDoc(collection(db, "owdLogs"), {
        feature: remoteMessage.data?.feature,
        tKirim: tKirim,
        tTerima: tTerima,
        owd: tTerima - tKirim,
        appState: "foreground",
        createdAt: serverTimestamp(),
      }).catch((e) => console.error("[OWD/FG] ERROR:", e));
    }
  );

  const unsubTapBg = onNotificationOpenedApp(messaging, () => {
    handleNotificationTap();
  });

  getInitialNotification(messaging).then((rm) => {
    if (rm) handleNotificationTap();
  });

  const handleNotificationTap = () => {
    router.replace("/(tabs)/jadwal");
  };

  return () => {
    unsubForeground();
    unsubTapBg?.();
  };
};
