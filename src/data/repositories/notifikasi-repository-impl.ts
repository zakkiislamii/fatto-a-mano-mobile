import { db } from "@/src/configs/firebase-config";
import { Notifikasi } from "@/src/domain/models/notifikasi";
import { INotifikasiRepository } from "@/src/domain/repositories/i-notifikasi-repository";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
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

      let personalNotifications: Notifikasi[] = [];
      let broadcastNotifications: Notifikasi[] = [];
      let readBroadcastIds: string[] = [];

      const mergeAndCallback = () => {
        const processedBroadcasts = broadcastNotifications.map((notif) => ({
          ...notif,
          read: readBroadcastIds.includes(notif.id),
        }));

        const merged = [...personalNotifications, ...processedBroadcasts];
        merged.sort((a, b) => {
          const timeA = a.created_at?.toMillis() || 0;
          const timeB = b.created_at?.toMillis() || 0;
          return timeB - timeA;
        });
        callback(merged);
      };

      const readBroadcastRef = doc(db, `users/${uid}/readBroadcasts/status`);
      const unsubscribeReadStatus = onSnapshot(
        readBroadcastRef,
        (docSnap) => {
          if (docSnap.exists()) {
            readBroadcastIds = docSnap.data().readIds || [];
          } else {
            readBroadcastIds = [];
          }
          mergeAndCallback();
        },
        (error) => {
          console.error(
            "[NotifikasiRepository] Error getting read status:",
            error
          );
        }
      );

      const personalColRef = collection(db, `users/${uid}/notifications`);
      const personalQuery = query(
        personalColRef,
        orderBy("created_at", "desc")
      );

      const unsubscribePersonal = onSnapshot(
        personalQuery,
        (querySnapshot) => {
          personalNotifications = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            personalNotifications.push({
              id: doc.id,
              body: data.body,
              created_at: data.created_at,
              read: data.read,
              title: data.title,
              isBroadcast: false,
            });
          });
          mergeAndCallback();
        },
        (error) => {
          console.error(
            "[NotifikasiRepository] Error getting personal notifications:",
            error
          );
        }
      );

      const broadcastColRef = collection(db, "broadcastNotifications");
      const broadcastQuery = query(
        broadcastColRef,
        orderBy("created_at", "desc")
      );

      const unsubscribeBroadcast = onSnapshot(
        broadcastQuery,
        (querySnapshot) => {
          broadcastNotifications = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            broadcastNotifications.push({
              id: doc.id,
              body: data.body,
              created_at: data.created_at,
              read: false,
              title: data.title,
              isBroadcast: true,
            });
          });
          mergeAndCallback();
        },
        (error) => {
          console.error(
            "[NotifikasiRepository] Error getting broadcast notifications:",
            error
          );
        }
      );

      return () => {
        unsubscribePersonal();
        unsubscribeBroadcast();
        unsubscribeReadStatus();
      };
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

      let personalUnreadCount = 0;
      let broadcastUnreadCount = 0;

      const updateTotalCount = () => {
        callback(personalUnreadCount + broadcastUnreadCount);
      };

      const personalColRef = collection(db, `users/${uid}/notifications`);
      const personalQuery = query(personalColRef, where("read", "==", false));

      const unsubscribePersonal = onSnapshot(
        personalQuery,
        (querySnapshot) => {
          personalUnreadCount = querySnapshot.size;
          updateTotalCount();
        },
        (error) => {
          console.error(
            "[NotifikasiRepository] Error getting personal unread count:",
            error
          );
        }
      );

      let totalBroadcasts = 0;
      let userReadBroadcasts = 0;

      const broadcastColRef = collection(db, "broadcastNotifications");
      const unsubscribeBroadcast = onSnapshot(
        broadcastColRef,
        (querySnapshot) => {
          totalBroadcasts = querySnapshot.size;
          broadcastUnreadCount = totalBroadcasts - userReadBroadcasts;
          updateTotalCount();
        },
        (error) => {
          console.error(
            "[NotifikasiRepository] Error getting broadcast count:",
            error
          );
        }
      );

      const readBroadcastRef = doc(db, `users/${uid}/readBroadcasts/status`);
      const unsubscribeReadStatus = onSnapshot(
        readBroadcastRef,
        (docSnap) => {
          if (docSnap.exists()) {
            userReadBroadcasts = (docSnap.data().readIds || []).length;
          } else {
            userReadBroadcasts = 0;
          }
          broadcastUnreadCount = totalBroadcasts - userReadBroadcasts;
          updateTotalCount();
        },
        (error) => {
          console.error(
            "[NotifikasiRepository] Error getting read status:",
            error
          );
        }
      );

      return () => {
        unsubscribePersonal();
        unsubscribeBroadcast();
        unsubscribeReadStatus();
      };
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

      const broadcastDocRef = doc(db, "broadcastNotifications", notificationId);
      const broadcastDoc = await getDoc(broadcastDocRef);

      if (broadcastDoc.exists()) {
        const userReadRef = doc(db, `users/${uid}/readBroadcasts/status`);
        const userReadDoc = await getDoc(userReadRef);

        let readIds: string[] = [];
        if (userReadDoc.exists()) {
          readIds = userReadDoc.data().readIds || [];
        }

        if (!readIds.includes(notificationId)) {
          readIds.push(notificationId);
          await setDoc(userReadRef, { readIds });
        }
      } else {
        const docRef = doc(db, `users/${uid}/notifications`, notificationId);
        await updateDoc(docRef, {
          read: true,
        });
      }
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
      const broadcastColRef = collection(db, "broadcastNotifications");
      const broadcastSnapshot = await getDocs(broadcastColRef);
      const allBroadcastIds = broadcastSnapshot.docs.map((doc) => doc.id);

      if (allBroadcastIds.length > 0) {
        const readBroadcastRef = doc(db, `users/${uid}/readBroadcasts/status`);
        await setDoc(readBroadcastRef, { readIds: allBroadcastIds });
      }
    } catch (error) {
      console.error("[NotifikasiRepository] Error marking all as read:", error);
      throw error;
    }
  }
}
