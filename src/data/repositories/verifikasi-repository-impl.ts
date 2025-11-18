import { StatusPengajuan } from "@/src/common/enums/status-pengajuan";
import { TipePengajuan } from "@/src/common/enums/tipe-pengajuan";
import { db } from "@/src/configs/firebase-config";
import { DaftarVerifikasi } from "@/src/domain/models/daftar-verifikasi";
import { DetailVerifikasi } from "@/src/domain/models/detail-verifikasi";
import { PengajuanIzin } from "@/src/domain/models/pengajuan-izin";
import { PengajuanLembur } from "@/src/domain/models/pengajuan-lembur";
import { PengajuanSakit } from "@/src/domain/models/pengajuan-sakit";
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
      const pengajuanQuery = collectionGroup(db, "pengajuan");

      return onSnapshot(
        pengajuanQuery,
        async (snapshot) => {
          const verifikasiList: DaftarVerifikasi[] = [];

          for (const docSnap of snapshot.docs) {
            const pengajuanData = docSnap.data();
            const uid = pengajuanData.uid;

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

      const userDocRef = doc(db, "users", uid);
      const pengajuanDocRef = doc(db, `users/${uid}/pengajuan`, pengajuanId);

      let karyawanData: ProfilKaryawan | null = null;
      let pengajuanData:
        | PengajuanIzin
        | PengajuanLembur
        | PengajuanSakit
        | null = null;
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

      const unsubPengajuan = onSnapshot(
        pengajuanDocRef,
        (pengajuanSnap) => {
          if (pengajuanSnap.exists()) {
            const data = pengajuanSnap.data();
            if (data.tipe === TipePengajuan.IZIN) {
              pengajuanData = {
                id: pengajuanSnap.id,
                uid: data.uid,
                tipe: TipePengajuan.IZIN,
                tanggal_pengajuan: data.tanggal_pengajuan,
                status: data.status,
                created_at: data.created_at,
                updated_at: data.updated_at,
                detail: {
                  keterangan: data.detail.keterangan ?? "",
                  bukti_pendukung: data.detail.bukti_pendukung ?? "",
                  tanggal_mulai: data.detail.tanggal_mulai ?? "",
                  tanggal_berakhir: data.detail.tanggal_berakhir ?? "",
                },
              };
            } else if (data.tipe === TipePengajuan.LEMBUR) {
              pengajuanData = {
                id: pengajuanSnap.id,
                uid: data.uid,
                tipe: TipePengajuan.LEMBUR,
                tanggal_pengajuan: data.tanggal_pengajuan,
                status: data.status,
                created_at: data.created_at,
                updated_at: data.updated_at,
                detail: {
                  keterangan: data.detail.keterangan ?? "",
                  bukti_pendukung: data.detail.bukti_pendukung ?? "",
                  durasi_lembur: data.detail.durasi_lembur ?? "",
                },
              };
            } else if (data.tipe === TipePengajuan.SAKIT) {
              pengajuanData = {
                id: pengajuanSnap.id,
                uid: data.uid,
                tipe: TipePengajuan.SAKIT,
                tanggal_pengajuan: data.tanggal_pengajuan,
                status: data.status,
                created_at: data.created_at,
                updated_at: data.updated_at,
                detail: {
                  keterangan: data.detail.keterangan ?? "",
                  bukti_pendukung: data.detail.bukti_pendukung ?? "",
                },
              };
            }
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
    status: StatusPengajuan.DISETUJUI | StatusPengajuan.DITOLAK
  ): Promise<void> {
    try {
      if (!uid || !pengajuanId) {
        throw new Error("UID atau Pengajuan ID tidak valid");
      }

      if (
        status !== StatusPengajuan.DISETUJUI &&
        status !== StatusPengajuan.DITOLAK
      ) {
        throw new Error("Status verifikasi tidak valid");
      }

      const pengajuanDocRef = doc(db, `users/${uid}/pengajuan`, pengajuanId);

      await updateDoc(pengajuanDocRef, {
        status: status,
        updated_at: Timestamp.now(),
      });
    } catch (error) {
      console.error("[VerifikasiRepo] Error verifikasi:", error);
      throw error;
    }
  }
}
