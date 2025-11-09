import { StatusPengajuan } from "@/src/common/enums/status-pengajuan";
import { TipePengajuan } from "@/src/common/enums/tipe-pengajuan";
import Today from "@/src/common/utils/get-today";
import { db } from "@/src/configs/firebase-config";
import { DaftarPengajuan } from "@/src/domain/models/daftar-pengajuan";
import { DetailPengajuanIzin } from "@/src/domain/models/detail-pengajuan-izin";
import { DetailPengajuanLembur } from "@/src/domain/models/detail-pengajuan-lembur";
import { DetailPengajuanSakit } from "@/src/domain/models/detail-pengajuan-sakit";
import { Pengajuan } from "@/src/domain/models/pengajuan";
import { PengajuanIzin } from "@/src/domain/models/pengajuan-izin";
import { PengajuanLembur } from "@/src/domain/models/pengajuan-lembur";
import { PengajuanSakit } from "@/src/domain/models/pengajuan-sakit";
import { IPengajuanRepository } from "@/src/domain/repositories/i-pengajuan-repository";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  onSnapshot,
  query,
  Timestamp,
  Unsubscribe,
  updateDoc,
  where,
} from "firebase/firestore";

export class PengajuanRepositoryImpl implements IPengajuanRepository {
  public getDaftar(
    uid: string,
    callback: (pengajuanList: DaftarPengajuan[]) => void
  ): Unsubscribe | null {
    try {
      if (!uid) return null;
      const colRef = collection(db, `users/${uid}/pengajuan`);

      return onSnapshot(
        colRef,
        (snapshot) => {
          const pengajuanList: DaftarPengajuan[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              uid: uid,
              tipe: data.tipe,
              tanggal_pengajuan: data.tanggal_pengajuan,
              status: data.status,
              created_at: data.created_at,
              updated_at: data.updated_at,
            };
          });
          callback(pengajuanList);
        },
        (error) => {
          console.error("[PengajuanRepo] Error getDaftar:", error);
          callback([]);
        }
      );
    } catch (error) {
      console.error("[PengajuanRepo] Error getDaftar:", error);
      throw error;
    }
  }

  public getDetail(
    uid: string,
    pengajuanId: string,
    callback: (pengajuan: Pengajuan | null) => void
  ): Unsubscribe | null {
    try {
      if (!uid || !pengajuanId) return null;
      const docRef = doc(db, `users/${uid}/pengajuan`, pengajuanId);

      return onSnapshot(
        docRef,
        (docSnap) => {
          if (!docSnap.exists()) {
            callback(null);
            return;
          }

          const data = docSnap.data() as DocumentData;
          const tipe = data.tipe as TipePengajuan;
          const rawDetail = data.detail ?? data;

          // Base pengajuan object
          const basePengajuan = {
            id: docSnap.id,
            uid: data.uid,
            tipe,
            tanggal_pengajuan: data.tanggal_pengajuan ?? "",
            status: data.status as StatusPengajuan,
            created_at: data.created_at as Timestamp,
            updated_at: data.updated_at as Timestamp,
          };

          let pengajuan: Pengajuan;

          // Assign detail based on tipe
          if (tipe === TipePengajuan.SAKIT) {
            pengajuan = {
              ...basePengajuan,
              detail: {
                keterangan: rawDetail.keterangan ?? "",
                bukti_pendukung: rawDetail.bukti_pendukung ?? "",
              },
            } as PengajuanSakit;
          } else if (tipe === TipePengajuan.IZIN) {
            pengajuan = {
              ...basePengajuan,
              detail: {
                keterangan: rawDetail.keterangan ?? "",
                bukti_pendukung: rawDetail.bukti_pendukung ?? "",
                tanggal_mulai: rawDetail.tanggal_mulai ?? "",
                tanggal_berakhir: rawDetail.tanggal_berakhir ?? "",
              },
            } as PengajuanIzin;
          } else if (tipe === TipePengajuan.LEMBUR) {
            pengajuan = {
              ...basePengajuan,
              detail: {
                keterangan: rawDetail.keterangan ?? "",
                bukti_pendukung: rawDetail.bukti_pendukung ?? "",
                durasi_lembur: rawDetail.durasi_lembur ?? "",
              },
            } as PengajuanLembur;
          } else {
            console.warn("[PengajuanRepo] Unknown tipe:", tipe);
            callback(null);
            return;
          }

          callback(pengajuan);
        },
        (error) => {
          console.error("[PengajuanRepo] Error getDetail:", error);
          callback(null);
        }
      );
    } catch (error) {
      console.error("[PengajuanRepo] Error getDetail:", error);
      throw error;
    }
  }

  public async hapus(uid: string, pengajuanId: string): Promise<void> {
    try {
      if (!uid || !pengajuanId) return;
      const docRef = doc(db, `users/${uid}/pengajuan`, pengajuanId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("[PengajuanRepo] Error hapus:", error);
      throw error;
    }
  }

  public async tambahIzin(
    uid: string,
    data: DetailPengajuanIzin
  ): Promise<void> {
    try {
      const colRef = collection(db, `users/${uid}/pengajuan`);
      const tanggal = Today();
      await addDoc(colRef, {
        uid: uid,
        tipe: TipePengajuan.IZIN,
        status: StatusPengajuan.MENUNGGU,
        tanggal_pengajuan: tanggal,
        detail: {
          ...data,
        },
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
      });
    } catch (error) {
      console.error("[PengajuanRepo] Error tambahIzin:", error);
      throw error;
    }
  }

  public async tambahLembur(
    uid: string,
    data: DetailPengajuanLembur
  ): Promise<void> {
    try {
      const tanggal = Today();
      const colRef = collection(db, `users/${uid}/pengajuan`);
      await addDoc(colRef, {
        uid: uid,
        tipe: TipePengajuan.LEMBUR,
        status: StatusPengajuan.MENUNGGU,
        tanggal_pengajuan: tanggal,
        detail: {
          ...data,
        },
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
      });
    } catch (error) {
      console.error("[PengajuanRepo] Error tambahLembur:", error);
      throw error;
    }
  }

  public async tambahSakit(
    uid: string,
    data: DetailPengajuanSakit
  ): Promise<void> {
    try {
      const tanggal = Today();
      const colRef = collection(db, `users/${uid}/pengajuan`);
      await addDoc(colRef, {
        uid: uid,
        tipe: TipePengajuan.SAKIT,
        status: StatusPengajuan.MENUNGGU,
        tanggal_pengajuan: tanggal,
        detail: {
          ...data,
        },
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
      });
    } catch (error) {
      console.error("[PengajuanRepo] Error tambahSakit:", error);
      throw error;
    }
  }

  public async editSakit(
    uid: string,
    pengajuanId: string,
    data: Partial<DetailPengajuanSakit>
  ): Promise<void> {
    try {
      const docRef = doc(db, `users/${uid}/pengajuan`, pengajuanId);

      const updateData: DocumentData = {
        updated_at: Timestamp.now(),
      };

      if (data.keterangan !== undefined) {
        updateData["detail.keterangan"] = data.keterangan;
      }

      if (data.bukti_pendukung !== undefined) {
        updateData["detail.bukti_pendukung"] = data.bukti_pendukung;
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error("[PengajuanRepo] Error editSakit:", error);
      throw error;
    }
  }

  public async editIzin(
    uid: string,
    pengajuanId: string,
    data: Partial<DetailPengajuanIzin>
  ): Promise<void> {
    try {
      const docRef = doc(db, `users/${uid}/pengajuan`, pengajuanId);

      const updateData: DocumentData = {
        updated_at: Timestamp.now(),
      };

      if (data.keterangan !== undefined) {
        updateData["detail.keterangan"] = data.keterangan;
      }

      if (data.bukti_pendukung !== undefined) {
        updateData["detail.bukti_pendukung"] = data.bukti_pendukung;
      }

      if (data.tanggal_mulai !== undefined) {
        updateData["detail.tanggal_mulai"] = data.tanggal_mulai;
      }

      if (data.tanggal_berakhir !== undefined) {
        updateData["detail.tanggal_berakhir"] = data.tanggal_berakhir;
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error("[PengajuanRepo] Error editIzin:", error);
      throw error;
    }
  }

  public async editLembur(
    uid: string,
    pengajuanId: string,
    data: Partial<DetailPengajuanLembur>
  ): Promise<void> {
    try {
      const docRef = doc(db, `users/${uid}/pengajuan`, pengajuanId);

      const updateData: DocumentData = {
        updated_at: Timestamp.now(),
      };

      if (data.keterangan !== undefined) {
        updateData["detail.keterangan"] = data.keterangan;
      }

      if (data.bukti_pendukung !== undefined) {
        updateData["detail.bukti_pendukung"] = data.bukti_pendukung;
      }

      if (data.durasi_lembur !== undefined) {
        updateData["detail.durasi_lembur"] = data.durasi_lembur;
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error("[PengajuanRepo] Error editLembur:", error);
      throw error;
    }
  }

  public getStatusIzinAktif(
    uid: string,
    tanggalHariIni: string,
    callback: (isIzinAktif: boolean) => void
  ): Unsubscribe | null {
    try {
      if (!uid) return null;
      const q = query(
        collection(db, `users/${uid}/pengajuan`),
        where("tipe", "==", TipePengajuan.IZIN),
        where("status", "==", StatusPengajuan.DISETUJUI)
      );

      return onSnapshot(
        q,
        (querySnapshot) => {
          let isIzinAktif = false;
          for (const doc of querySnapshot.docs) {
            const data = doc.data();
            if (
              tanggalHariIni >= data.tanggal_mulai &&
              tanggalHariIni <= data.tanggal_berakhir
            ) {
              isIzinAktif = true;
              break;
            }
          }
          callback(isIzinAktif);
        },
        (error) => {
          console.error("[PengajuanRepo] Error getStatusIzinAktif:", error);
          callback(false);
        }
      );
    } catch (error) {
      console.error("[PengajuanRepo] Error getStatusIzinAktif:", error);
      throw error;
    }
  }

  public getStatusSakitAktif(
    uid: string,
    tanggalHariIni: string,
    callback: (isSakitAktif: boolean) => void
  ): Unsubscribe | null {
    try {
      if (!uid) return null;
      const q = query(
        collection(db, `users/${uid}/pengajuan`),
        where("tipe", "==", TipePengajuan.SAKIT),
        where("status", "==", StatusPengajuan.DISETUJUI),
        where("tanggal_pengajuan", "==", tanggalHariIni)
      );

      return onSnapshot(
        q,
        (querySnapshot) => {
          callback(!querySnapshot.empty);
        },
        (error) => {
          console.error("[PengajuanRepo] Error getStatusSakitAktif:", error);
          callback(false);
        }
      );
    } catch (error) {
      console.error("[PengajuanRepo] Error getStatusSakitAktif:", error);
      throw error;
    }
  }
}
