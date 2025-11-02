import { StatusPengajuan } from "@/src/common/enums/status-pengajuan";
import { TipePengajuan } from "@/src/common/enums/tipe-pengajuan";
import { db } from "@/src/configs/firebase-config";
import { DaftarVerifikasi } from "@/src/domain/models/daftar-verifikasi";
import { DetailVerifikasi } from "@/src/domain/models/detail-verifikasi";
import { Pengajuan } from "@/src/domain/models/pengajuan";
import { ProfilKaryawan } from "@/src/domain/models/profil-karyawan";
import { IVerifikasiRepository } from "@/src/domain/repositories/i-verifikasi-repository";
import {
  collectionGroup,
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
  Unsubscribe,
  updateDoc,
} from "firebase/firestore";

export class VerifikasiRepositoryImpl implements IVerifikasiRepository {
  public getAllVerifikasi(
    callback: (verifikasiList: DaftarVerifikasi[]) => void
  ): Unsubscribe | null {
    try {
      // Query semua pengajuan dari semua user menggunakan collectionGroup
      const pengajuanQuery = collectionGroup(db, "pengajuan");

      return onSnapshot(
        pengajuanQuery,
        async (snapshot) => {
          const verifikasiList: DaftarVerifikasi[] = [];

          // Process setiap pengajuan
          for (const docSnap of snapshot.docs) {
            const pengajuanData = docSnap.data();
            const uid = pengajuanData.uid;

            // Fetch data karyawan
            const userDocRef = doc(db, "users", uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
              const userData = userDocSnap.data() as ProfilKaryawan;

              verifikasiList.push({
                id: docSnap.id,
                uid: uid,
                tipe: pengajuanData.tipe as TipePengajuan,
                tanggal_pengajuan: pengajuanData.tanggal_pengajuan,
                status: pengajuanData.status as StatusPengajuan,
                nama: userData.nama || "-",
                divisi: userData.divisi || "-",
              });
            }
          }

          callback(verifikasiList);
        },
        (error) => {
          console.error("[VerifikasiRepo] Error getAllVerifikasi:", error);
          callback([]);
        }
      );
    } catch (error) {
      console.error("[VerifikasiRepo] Error getAllVerifikasi:", error);
      throw error;
    }
  }

  public getDetailKaryawan(
    uid: string,
    pengajuanId: string,
    callback: (detail: DetailVerifikasi | null) => void
  ): Unsubscribe | null {
    try {
      if (!uid || !pengajuanId) return null;

      // Listen to both user and pengajuan documents
      const userDocRef = doc(db, "users", uid);
      const pengajuanDocRef = doc(db, `users/${uid}/pengajuan`, pengajuanId);

      let karyawanData: ProfilKaryawan | null = null;
      let pengajuanData: Pengajuan | null = null;
      let unsubscribeCount = 0;

      const checkAndCallback = () => {
        if (unsubscribeCount === 2) {
          if (karyawanData && pengajuanData) {
            callback({
              karyawan: karyawanData,
              pengajuan: pengajuanData,
            });
          } else {
            callback(null);
          }
        }
      };

      // Listen to user data
      const unsubUser = onSnapshot(
        userDocRef,
        (userSnap) => {
          if (userSnap.exists()) {
            karyawanData = userSnap.data() as ProfilKaryawan;
          }
          unsubscribeCount++;
          checkAndCallback();
        },
        (error) => {
          console.error("[VerifikasiRepo] Error listening to user:", error);
          callback(null);
        }
      );

      // Listen to pengajuan data
      const unsubPengajuan = onSnapshot(
        pengajuanDocRef,
        (pengajuanSnap) => {
          if (pengajuanSnap.exists()) {
            const data = pengajuanSnap.data();
            let detailData: any = {
              keterangan: data.keterangan,
              bukti_pendukung: data.bukti_pendukung,
            };

            if (data.tipe === TipePengajuan.izin) {
              detailData.tanggal_mulai = data.tanggal_mulai;
              detailData.tanggal_berakhir = data.tanggal_berakhir;
            } else if (data.tipe === TipePengajuan.lembur) {
              detailData.durasi_lembur = data.durasi_lembur;
            }

            pengajuanData = {
              id: pengajuanSnap.id,
              uid: data.uid,
              tipe: data.tipe,
              tanggal_pengajuan: data.tanggal_pengajuan,
              status: data.status,
              detail: detailData,
              created_at: data.created_at,
              updated_at: data.updated_at,
            };
          }
          unsubscribeCount++;
          checkAndCallback();
        },
        (error) => {
          console.error(
            "[VerifikasiRepo] Error listening to pengajuan:",
            error
          );
          callback(null);
        }
      );

      // Return combined unsubscribe function
      return () => {
        unsubUser();
        unsubPengajuan();
      };
    } catch (error) {
      console.error("[VerifikasiRepo] Error getDetailKaryawan:", error);
      throw error;
    }
  }

  public async verifikasiPengajuan(
    uid: string,
    pengajuanId: string,
    status: StatusPengajuan.disetujui | StatusPengajuan.ditolak
  ): Promise<void> {
    try {
      if (!uid || !pengajuanId) {
        throw new Error("UID atau Pengajuan ID tidak valid");
      }

      if (
        status !== StatusPengajuan.disetujui &&
        status !== StatusPengajuan.ditolak
      ) {
        throw new Error("Status verifikasi tidak valid");
      }

      const pengajuanDocRef = doc(db, `users/${uid}/pengajuan`, pengajuanId);

      await updateDoc(pengajuanDocRef, {
        status: status,
        updated_at: Timestamp.now(),
      });

      console.log(
        `[VerifikasiRepo] Pengajuan ${pengajuanId} berhasil ${
          status === StatusPengajuan.disetujui ? "disetujui" : "ditolak"
        }`
      );
    } catch (error) {
      console.error("[VerifikasiRepo] Error verifikasi:", error);
      throw error;
    }
  }
}
