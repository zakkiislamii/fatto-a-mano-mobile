import { Notifikasi } from "@/src/domain/models/notifikasi";
import { Unsubscribe } from "firebase/firestore";

export interface INotifikasiRepository {
  getAllRealtime(
    uid: string,
    callback: (notifikasi: Notifikasi[]) => void
  ): Unsubscribe | null;

  getUnreadCountRealtime(
    uid: string,
    callback: (count: number) => void
  ): Unsubscribe | null;

  markAsRead(uid: string, notificationId: string): Promise<void>;

  markAllAsRead(uid: string): Promise<void>;
}
