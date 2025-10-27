import { Notifikasi } from "@/src/domain/models/notifikasi";
import { NotifikasiRepository } from "@/src/domain/repositories/notifikasi/notifikasi-repository";
import { useEffect, useState } from "react";

const useGetNotifikasi = (uid: string) => {
  const [notifikasi, setNotifikasi] = useState<Notifikasi[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const repo = new NotifikasiRepository(uid);
    setLoading(true);

    const unsubscribeNotif = repo.getAllRealtime((data) => {
      setNotifikasi(data);
      setLoading(false);
    });

    const unsubscribeCount = repo.getUnreadCountRealtime((count) => {
      setUnreadCount(count);
    });

    return () => {
      unsubscribeNotif();
      unsubscribeCount();
    };
  }, [uid]);

  const markAsRead = async (notificationId: string) => {
    try {
      const repo = new NotifikasiRepository(uid);
      await repo.markAsRead(notificationId);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const repo = new NotifikasiRepository(uid);
      await repo.markAllAsRead();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return {
    notifikasi,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
  };
};

export default useGetNotifikasi;
