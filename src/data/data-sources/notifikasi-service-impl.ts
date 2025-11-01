import { INotifikasiService } from "@/src/domain/services/i-notifikasi-service";
import axios from "axios";
import Constants, { ExecutionEnvironment } from "expo-constants";
import * as Notifications from "expo-notifications";

export class NotifikasiServiceImpl implements INotifikasiService {
  private readonly url: string = process.env.EXPO_PUBLIC_BE_URL || "";

  public async RegisterToken(uid: string): Promise<boolean> {
    try {
      if (!uid) throw new Error("UID diperlukan untuk mendaftarkan token.");

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
        uid: uid,
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
      if (!uid) throw new Error("UID diperlukan untuk menghapus token.");

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
        uid: uid,
        token,
      });
      return true;
    } catch (error) {
      console.error("[Notif] Delete token failed:", error);
      return false;
    }
  }
  public async SendToKaryawan(uid: string): Promise<boolean> {
    try {
      if (!uid) throw new Error("UID diperlukan untuk mengirim notif.");

      const isExpoGo =
        Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
      if (isExpoGo) {
        console.warn("[Notif] Skipped send notification (Expo Go).");
        return false;
      }

      await axios.post(`${this.url}/notifications/send-to-user`, {
        uid: uid,
        title: "Perubahan Jadwal Kerja",
        body: "Jadwal kerja Anda telah diperbarui. Silakan periksa aplikasi untuk detail lebih lanjut.",
      });
      return true;
    } catch (error) {
      console.error("[Notif] Send notification failed:", error);
      return false;
    }
  }
}
