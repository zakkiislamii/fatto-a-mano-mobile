import { StatusPengajuan } from "@/src/common/enums/status-pengajuan";
import { TipePengajuan } from "@/src/common/enums/tipe-pengajuan";
import {
  EditPengajuanIzinData,
  EditPengajuanLemburData,
  EditPengajuanSakitData,
} from "@/src/common/types/edit-pengajuan-data";
import {
  TambahPengajuanIzinData,
  TambahPengajuanLemburData,
  TambahPengajuanSakitData,
} from "@/src/common/types/tambah-pengajuan-data";
import { db } from "@/src/configs/firebase-config";
import { DaftarPengajuan } from "@/src/domain/models/daftar-pengajuan";
import { Pengajuan } from "@/src/domain/models/pengajuan";
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

          const data = docSnap.data();
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

          callback({
            id: docSnap.id,
            uid: data.uid,
            tipe: data.tipe,
            tanggal_pengajuan: data.tanggal_pengajuan,
            status: data.status,
            detail: detailData,
            created_at: data.created_at,
            updated_at: data.updated_at,
          });
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
    data: TambahPengajuanIzinData
  ): Promise<void> {
    try {
      const colRef = collection(db, `users/${uid}/pengajuan`);
      await addDoc(colRef, {
        uid: uid,
        tipe: TipePengajuan.izin,
        status: StatusPengajuan.menunggu,
        ...data,
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
    data: TambahPengajuanLemburData
  ): Promise<void> {
    try {
      const colRef = collection(db, `users/${uid}/pengajuan`);
      await addDoc(colRef, {
        uid: uid,
        tipe: TipePengajuan.lembur,
        status: StatusPengajuan.menunggu,
        ...data,
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
    data: TambahPengajuanSakitData
  ): Promise<void> {
    try {
      const colRef = collection(db, `users/${uid}/pengajuan`);
      await addDoc(colRef, {
        uid: uid,
        tipe: TipePengajuan.sakit,
        status: StatusPengajuan.menunggu,
        ...data,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
      });
    } catch (error) {
      console.error("[PengajuanRepo] Error tambahSakit:", error);
      throw error;
    }
  }

  public async editIzin(
    uid: string,
    pengajuanId: string,
    data: EditPengajuanIzinData
  ): Promise<void> {
    try {
      const docRef = doc(db, `users/${uid}/pengajuan`, pengajuanId);
      const updateData: DocumentData = {
        ...data,
        updated_at: Timestamp.now(),
      };
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error("[PengajuanRepo] Error editIzin:", error);
      throw error;
    }
  }

  public async editLembur(
    uid: string,
    pengajuanId: string,
    data: EditPengajuanLemburData
  ): Promise<void> {
    try {
      const docRef = doc(db, `users/${uid}/pengajuan`, pengajuanId);
      const updateData: DocumentData = {
        ...data,
        updated_at: Timestamp.now(),
      };
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error("[PengajuanRepo] Error editLembur:", error);
      throw error;
    }
  }

  public async editSakit(
    uid: string,
    pengajuanId: string,
    data: EditPengajuanSakitData
  ): Promise<void> {
    try {
      const docRef = doc(db, `users/${uid}/pengajuan`, pengajuanId);
      const updateData: DocumentData = {
        ...data,
        updated_at: Timestamp.now(),
      };
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error("[PengajuanRepo] Error editSakit:", error);
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
        where("tipe", "==", TipePengajuan.izin),
        where("status", "==", StatusPengajuan.disetujui)
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
        where("tipe", "==", TipePengajuan.sakit),
        where("status", "==", StatusPengajuan.disetujui),
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
