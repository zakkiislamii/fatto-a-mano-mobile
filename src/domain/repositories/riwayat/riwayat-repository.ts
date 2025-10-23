import { PresensiKeluar } from "@/src/common/types/presensi-keluar";
import { PresensiMasuk } from "@/src/common/types/presensi-masuk";
import { db } from "@/src/configs/firebaseConfig";
import { Unsubscribe } from "firebase/auth";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { Presensi } from "../../models/presensi";

export class RiwayatRepository {
  private readonly uid: string;

  public constructor(uid: string) {
    this.uid = uid;
  }

  public getAllPresensiByMonth(
    year: number,
    month: number,
    cb: (presensiList: Presensi[]) => void
  ): Unsubscribe {
    try {
      const presensiList: Presensi[] = [];
      const unsubscribes: Unsubscribe[] = [];

      const daysInMonth = new Date(year, month + 1, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const dateString = `${year}-${String(month + 1).padStart(
          2,
          "0"
        )}-${String(day).padStart(2, "0")}`;

        const docRef = doc(db, "presensi", dateString, "users", this.uid);

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
                uid: data.uid ?? this.uid,
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
              `RiwayatRepository onSnapshot error for ${dateString}:`,
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
      console.error("RiwayatRepository getAllPresensiByMonth error:", error);
      throw error;
    }
  }

  public getPresensiByDate(
    tanggal: string,
    cb: (presensi: Presensi | null) => void
  ): Unsubscribe {
    try {
      const year = parseInt(tanggal.split("-")[0]);
      const month = parseInt(tanggal.split("-")[1]) - 1;

      const unsubscribe = this.getAllPresensiByMonth(year, month, (list) => {
        const found = list.find((p) => p.tanggal === tanggal);
        cb(found || null);
      });

      return unsubscribe;
    } catch (error) {
      console.error("RiwayatRepository getPresensiByDate error:", error);
      throw error;
    }
  }
}
