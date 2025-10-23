import { StatusPengajuan } from "@/src/common/enums/status-pengajuan";
import { DaftarPengajuan } from "@/src/common/types/daftar-pengajuan";
import { db } from "@/src/configs/firebaseConfig";
import { Unsubscribe } from "firebase/auth";
import {
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentReference,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { Pengajuan } from "../models/pengajuan";

export abstract class PengajuanRepository {
  protected readonly uid: string;
  protected readonly colRef: CollectionReference;
  protected id: string = "";
  protected tanggal_pengajuan: string;
  protected keterangan: string = "";
  protected status: StatusPengajuan | null = null;
  protected bukti_pendukung: string = "";

  public constructor(uid: string, tanggal_pengajuan: string) {
    this.uid = uid;
    this.tanggal_pengajuan = tanggal_pengajuan;
    this.colRef = collection(db, "pengajuan");
  }

  public setId(id: string): void {
    this.id = id;
  }

  public getId(): string {
    return this.id;
  }

  protected getDocRef(): DocumentReference {
    if (!this.id) {
      throw new Error(
        "ID pengajuan belum diatur. Gunakan setId() terlebih dahulu."
      );
    }
    return doc(this.colRef, this.id);
  }

  public setStatus(status: StatusPengajuan): void {
    this.status = status;
  }

  public getStatus(): StatusPengajuan | null {
    return this.status;
  }

  public setTanggalPengajuan(tanggal: string): void {
    this.tanggal_pengajuan = tanggal;
  }

  public getTanggalPengajuan(): string {
    return this.tanggal_pengajuan;
  }

  public setKeterangan(keterangan: string): void {
    this.keterangan = keterangan;
  }

  public getKeterangan(): string {
    return this.keterangan;
  }

  public setBuktiPendukung(bukti: string): void {
    this.bukti_pendukung = bukti;
  }

  public getBuktiPendukung(): string {
    return this.bukti_pendukung;
  }

  public getDaftar(
    callback: (pengajuanList: DaftarPengajuan[]) => void
  ): Unsubscribe {
    try {
      const q = query(this.colRef, where("uid", "==", this.uid));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const pengajuanList: DaftarPengajuan[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          pengajuanList.push({
            id: doc.id,
            uid: data.uid,
            tipe: data.tipe,
            tanggal_pengajuan: data.tanggal_pengajuan,
            status: data.status,
            created_at: data.created_at,
            updated_at: data.updated_at,
          });
        });

        callback(pengajuanList);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error getting pengajuan list realtime:", error);
      throw error;
    }
  }

  abstract tambah(): Promise<void>;

  abstract getDetail(
    callback: (pengajuan: Pengajuan | null) => void
  ): Unsubscribe;

  abstract edit(): Promise<void>;

  public async hapus(): Promise<void> {
    try {
      const docRef = this.getDocRef();
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting pengajuan lembur:", error);
      throw error;
    }
  }
}
