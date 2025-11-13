import { db } from "@/src/configs/firebase-config";
import { Notifikasi } from "@/src/domain/models/notifikasi";
import { INotifikasiRepository } from "@/src/domain/repositories/i-notifikasi-repository";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

export class NotifikasiRepositoryImpl implements INotifikasiRepository {
  public getAllRealtime(
    uid: string,
    callback: (notifikasi: Notifikasi[]) => void
  ): Unsubscribe | null {
    try {
      if (!uid) return null;
      const colRef = collection(db, `users/${uid}/notifications`);
      const q = query(colRef, orderBy("created_at", "desc"));

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const notifikasi: Notifikasi[] = [];

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            notifikasi.push({
              id: doc.id,
              body: data.body,
              created_at: data.created_at,
              read: data.read,
              title: data.title,
            });
          });

          callback(notifikasi);
        },
        (error) => {
          console.error(
            "[NotifikasiRepository] Error getting notifications realtime:",
            error
          );
          callback([]);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error(
        "[NotifikasiRepository] Error getting notifications realtime:",
        error
      );
      throw error;
    }
  }

  public getUnreadCountRealtime(
    uid: string,
    callback: (count: number) => void
  ): Unsubscribe | null {
    try {
      if (!uid) return null;
      const colRef = collection(db, `users/${uid}/notifications`);

      const q = query(colRef, where("read", "==", false));

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          callback(querySnapshot.size);
        },
        (error) => {
          console.error(
            "[NotifikasiRepository] Error getting unread count:",
            error
          );
          callback(0);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error(
        "[NotifikasiRepository] Error getting unread count realtime:",
        error
      );
      throw error;
    }
  }

  public async markAsRead(uid: string, notificationId: string): Promise<void> {
    try {
      if (!uid || !notificationId) return;
      const docRef = doc(db, `users/${uid}/notifications`, notificationId);
      await updateDoc(docRef, {
        read: true,
      });
    } catch (error) {
      console.error(
        "[NotifikasiRepository] Error marking notification as read:",
        error
      );
      throw error;
    }
  }

  public async markAllAsRead(uid: string): Promise<void> {
    try {
      if (!uid) return;
      const colRef = collection(db, `users/${uid}/notifications`);
      const q = query(colRef, where("read", "==", false));
      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);

      querySnapshot.forEach((doc) => {
        batch.update(doc.ref, { read: true });
      });

      await batch.commit();
    } catch (error) {
      console.error("[NotifikasiRepository] Error marking all as read:", error);
      throw error;
    }
  }
}
