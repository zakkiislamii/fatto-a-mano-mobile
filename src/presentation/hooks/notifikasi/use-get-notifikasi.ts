import { NotifikasiRepositoryImpl } from "@/src/data/repositories/notifikasi-repository-impl";
import { Notifikasi } from "@/src/domain/models/notifikasi";
import { INotifikasiRepository } from "@/src/domain/repositories/i-notifikasi-repository";
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

    const repo: INotifikasiRepository = new NotifikasiRepositoryImpl();
    setLoading(true);

    const unsubscribeNotif = repo.getAllRealtime(uid, (data) => {
      setNotifikasi(data);
      setLoading(false);
    });

    const unsubscribeCount = repo.getUnreadCountRealtime(uid, (count) => {
      setUnreadCount(count);
    });

    return () => {
      if (unsubscribeNotif) {
        unsubscribeNotif();
      }
      if (unsubscribeCount) {
        unsubscribeCount();
      }
    };
  }, [uid]);

  const markAsRead = async (notificationId: string) => {
    try {
      const repo: INotifikasiRepository = new NotifikasiRepositoryImpl();
      await repo.markAsRead(uid, notificationId);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const repo: INotifikasiRepository = new NotifikasiRepositoryImpl();
      await repo.markAllAsRead(uid);
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
