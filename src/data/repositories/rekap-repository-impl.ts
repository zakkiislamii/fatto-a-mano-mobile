import { db } from "@/src/configs/firebase-config";
import { JadwalKaryawan } from "@/src/domain/models/jadwal-karyawan";
import { Presensi } from "@/src/domain/models/presensi";
import { ProfilKaryawan } from "@/src/domain/models/profil-karyawan";
import { RekapKaryawan } from "@/src/domain/models/rekap";
import { IRekapRepository } from "@/src/domain/repositories/i-rekap-repository";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

export class RekapRepositoryImpl implements IRekapRepository {
  public async getRekapPresensi(
    tanggalMulai: string,
    tanggalAkhir: string
  ): Promise<RekapKaryawan[]> {
    try {
      if (!tanggalMulai || !tanggalAkhir) {
        throw new Error("Tanggal mulai dan akhir harus diisi");
      }

      // Get all users
      const usersSnapshot = await getDocs(collection(db, "users"));
      const rekapList: RekapKaryawan[] = [];

      // Generate date range
      const dateRange = this.generateDateRange(tanggalMulai, tanggalAkhir);

      // For each user, get presensi for date range
      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data() as ProfilKaryawan;
        const uid = userDoc.id;

        const presensiList: Presensi[] = [];

        // Get presensi for each date
        for (const tanggal of dateRange) {
          try {
            const presensiDocRef = doc(db, "presensi", tanggal, "users", uid);
            const presensiDoc = await getDoc(presensiDocRef);

            if (presensiDoc.exists()) {
              presensiList.push(presensiDoc.data() as Presensi);
            } else {
              // Create empty presensi for missing date
              presensiList.push({
                uid: uid,
                tanggal: tanggal,
                status: null as any,
                presensi_masuk: null as any,
                presensi_keluar: null as any,
                created_at: null as any,
                updated_at: null as any,
              });
            }
          } catch (error) {
            console.error(
              `[RekapRepo] Error fetching presensi for ${uid} on ${tanggal}:`,
              error
            );
            // Add empty presensi on error
            presensiList.push({
              uid: uid,
              tanggal: tanggal,
              status: null as any,
              presensi_masuk: null as any,
              presensi_keluar: null as any,
              created_at: null as any,
              updated_at: null as any,
            });
          }
        }

        rekapList.push({
          uid: uid,
          email: userData.email || "-",
          nama: userData.nama || "-",
          divisi: userData.divisi || "-",
          jadwal: userData.jadwal || ({} as JadwalKaryawan),
          presensi_list: presensiList,
        });
      }

      console.log(
        `[RekapRepo] Retrieved rekap for ${rekapList.length} users from ${tanggalMulai} to ${tanggalAkhir}`
      );
      return rekapList;
    } catch (error) {
      console.error("[RekapRepo] Error getRekapPresensi:", error);
      throw error;
    }
  }

  private generateDateRange(startDate: string, endDate: string): string[] {
    const dates: string[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    while (start <= end) {
      dates.push(start.toISOString().split("T")[0]);
      start.setDate(start.getDate() + 1);
    }

    return dates;
  }
}
