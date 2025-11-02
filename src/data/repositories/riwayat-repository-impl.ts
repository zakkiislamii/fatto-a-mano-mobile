import { db } from "@/src/configs/firebase-config";
import { Presensi } from "@/src/domain/models/presensi";
import { PresensiKeluar } from "@/src/domain/models/presensi-keluar";
import { PresensiMasuk } from "@/src/domain/models/presensi-masuk";
import { IRiwayatRepository } from "@/src/domain/repositories/riwayat/i-riwayat-repository";
import { doc, onSnapshot, Timestamp, Unsubscribe } from "firebase/firestore";

export class RiwayatRepositoryImpl implements IRiwayatRepository {
  public getAllPresensiByMonth(
    uid: string,
    year: number,
    month: number,
    cb: (presensiList: Presensi[]) => void
  ): Unsubscribe | null {
    try {
      if (!uid) return null;

      const presensiList: Presensi[] = [];
      const unsubscribes: Unsubscribe[] = [];

      const daysInMonth = new Date(year, month + 1, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const dateString = `${year}-${String(month + 1).padStart(
          2,
          "0"
        )}-${String(day).padStart(2, "0")}`;

        const docRef = doc(db, "presensi", dateString, "users", uid);

        const unsubscribe = onSnapshot(
          docRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data() as Presensi;

              const presensi_masuk: PresensiMasuk = {
                waktu: data.presensi_masuk?.waktu ?? "",
                terlambat: data.presensi_masuk?.terlambat ?? false,
                durasi_terlambat: data.presensi_masuk?.durasi_terlambat,
              };

              const presensi_keluar: PresensiKeluar = {
                waktu: data.presensi_keluar?.waktu ?? "",
                lembur: data.presensi_keluar?.lembur ?? false,
                durasi_lembur: data.presensi_keluar?.durasi_lembur,
                keluar_awal: data.presensi_keluar?.keluar_awal ?? false,
                alasan_keluar_awal: data.presensi_keluar?.alasan_keluar_awal,
                bukti_keluar_awal: data.presensi_keluar?.bukti_keluar_awal,
              };

              const presensi: Presensi = {
                uid: data.uid ?? uid,
                tanggal: data.tanggal ?? dateString,
                status: data.status ?? (null as any),
                presensi_masuk,
                presensi_keluar,
                created_at: data.created_at ?? Timestamp.now(),
                updated_at: data.updated_at ?? Timestamp.now(),
              };

              const existingIndex = presensiList.findIndex(
                (p) => p.tanggal === dateString
              );
              if (existingIndex >= 0) {
                presensiList[existingIndex] = presensi;
              } else {
                presensiList.push(presensi);
              }
            } else {
              const existingIndex = presensiList.findIndex(
                (p) => p.tanggal === dateString
              );
              if (existingIndex >= 0) {
                presensiList.splice(existingIndex, 1);
              }
            }

            cb([...presensiList]);
          },
          (error: unknown) => {
            console.error(
              `[RiwayatRepository] onSnapshot error for ${dateString}:`,
              error
            );
          }
        );

        unsubscribes.push(unsubscribe);
      }

      return () => {
        unsubscribes.forEach((unsub) => unsub());
      };
    } catch (error) {
      console.error("[RiwayatRepository] getAllPresensiByMonth error:", error);
      throw error;
    }
  }

  public getPresensiByDate(
    uid: string,
    tanggal: string,
    cb: (presensi: Presensi | null) => void
  ): Unsubscribe | null {
    try {
      if (!uid || !tanggal) return null;

      const docRef = doc(db, "presensi", tanggal, "users", uid);

      const unsubscribe = onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as Presensi;

            const presensi_masuk: PresensiMasuk = {
              waktu: data.presensi_masuk?.waktu ?? "",
              terlambat: data.presensi_masuk?.terlambat ?? false,
              durasi_terlambat: data.presensi_masuk?.durasi_terlambat,
            };

            const presensi_keluar: PresensiKeluar = {
              waktu: data.presensi_keluar?.waktu ?? "",
              lembur: data.presensi_keluar?.lembur ?? false,
              durasi_lembur: data.presensi_keluar?.durasi_lembur,
              keluar_awal: data.presensi_keluar?.keluar_awal ?? false,
              alasan_keluar_awal: data.presensi_keluar?.alasan_keluar_awal,
              bukti_keluar_awal: data.presensi_keluar?.bukti_keluar_awal,
            };

            const presensi: Presensi = {
              uid: data.uid ?? uid,
              tanggal: data.tanggal ?? tanggal,
              status: data.status ?? (null as any),
              presensi_masuk,
              presensi_keluar,
              created_at: data.created_at ?? Timestamp.now(),
              updated_at: data.updated_at ?? Timestamp.now(),
            };
            cb(presensi);
          } else {
            cb(null);
          }
        },
        (error: unknown) => {
          console.error(
            `[RiwayatRepository] getPresensiByDate error for ${tanggal}:`,
            error
          );
          cb(null);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error("[RiwayatRepository] getPresensiByDate error:", error);
      throw error;
    }
  }
}
