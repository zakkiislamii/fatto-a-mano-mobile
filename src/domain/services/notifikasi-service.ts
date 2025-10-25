import axios from "axios";
import Constants, { ExecutionEnvironment } from "expo-constants";
import * as Notifications from "expo-notifications";

export class NotifikasiService {
  private url: string = process.env.EXPO_PUBLIC_BE_URL || "";

  public async RegisterToken(uid: string): Promise<boolean> {
    try {
      const isExpoGo =
        Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
      if (isExpoGo) {
        console.warn(
          "[Notif] Skipped token register (Expo Go). Build with EAS/Dev Client to get device token."
        );
        return false;
      }

      const { data: token } = await Notifications.getDevicePushTokenAsync();

      if (!token) {
        console.warn("[Notif] Device push token is empty.");
        return false;
      }

      await axios.post(`${this.url}/notifications/register-token`, {
        uid,
        token,
      });
      return true;
    } catch (error) {
      console.error("[Notif] Register token failed:", error);
      return false;
    }
  }

  public async DeleteToken(uid: string): Promise<boolean> {
    try {
      const isExpoGo =
        Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
      if (isExpoGo) {
        console.warn(
          "[Notif] Skipped token delete (Expo Go). No token to delete."
        );
        return false;
      }

      const { data: token } = await Notifications.getDevicePushTokenAsync();

      if (!token) {
        console.warn("[Notif] Device push token is empty.");
        return false;
      }

      await axios.post(`${this.url}/notifications/unregister-token`, {
        uid,
        token,
      });
      return true;
    } catch (error) {
      console.error("[Notif] Delete token failed:", error);
      return false;
    }
  }
}
