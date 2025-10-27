import { db } from "@/src/configs/firebase-config";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
  updateDoc,
} from "firebase/firestore";
import { Notifikasi } from "../../models/notifikasi";

export class NotifikasiRepository {
  private readonly uid: string;
  private colRef;

  constructor(uid: string) {
    this.uid = uid;
    this.colRef = collection(db, `users/${this.uid}/notifications`);
  }

  public getAllRealtime(
    callback: (notifikasi: Notifikasi[]) => void
  ): Unsubscribe {
    try {
      const q = query(this.colRef, orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const notifikasi: Notifikasi[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          notifikasi.push({
            id: doc.id,
            body: data.body,
            createdAt: data.createdAt,
            read: data.read,
            title: data.title,
          });
        });

        callback(notifikasi);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error getting notifications realtime:", error);
      throw error;
    }
  }

  public getUnreadCountRealtime(
    callback: (count: number) => void
  ): Unsubscribe {
    try {
      const q = query(this.colRef);

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let unreadCount = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (!data.read) {
            unreadCount++;
          }
        });

        callback(unreadCount);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error getting unread count realtime:", error);
      throw error;
    }
  }

  public async markAsRead(notificationId: string): Promise<void> {
    try {
      const docRef = doc(this.colRef, notificationId);
      await updateDoc(docRef, {
        read: true,
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  public async markAllAsRead(): Promise<void> {
    try {
      const q = query(this.colRef);
      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const updatePromises = querySnapshot.docs
          .filter((doc) => !doc.data().read)
          .map((doc) => updateDoc(doc.ref, { read: true }));

        await Promise.all(updatePromises);
        unsubscribe();
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }
}
