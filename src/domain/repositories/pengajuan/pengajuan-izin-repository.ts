import { StatusPengajuan } from "@/src/common/enums/status-pengajuan";
import { TipePengajuan } from "@/src/common/enums/tipe-pengajuan";
import { Unsubscribe } from "firebase/auth";
import { addDoc, onSnapshot, Timestamp, updateDoc } from "firebase/firestore";
import { PengajuanRepository } from "../../abstracts/pengajuan-abstract";
import { Pengajuan } from "../../models/pengajuan";

export class PengajuanIzinRepository extends PengajuanRepository {
  private tanggal_mulai: string = "";
  private tanggal_berakhir: string = "";

  public setTanggalMulai(tanggal: string): void {
    this.tanggal_mulai = tanggal;
  }

  public getTanggalMulai(): string {
    return this.tanggal_mulai;
  }

  public setTanggalBerakhir(tanggal: string): void {
    this.tanggal_berakhir = tanggal;
  }

  public getTanggalBerakhir(): string {
    return this.tanggal_berakhir;
  }

  public async tambah(): Promise<void> {
    try {
      await addDoc(this.colRef, {
        uid: this.uid,
        tipe: TipePengajuan.izin,
        tanggal_pengajuan: this.tanggal_pengajuan,
        status: StatusPengajuan.menunggu,
        keterangan: this.keterangan,
        bukti_pendukung: this.bukti_pendukung,
        tanggal_mulai: this.tanggal_mulai,
        tanggal_berakhir: this.tanggal_berakhir,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding pengajuan sakit:", error);
      throw error;
    }
  }

  public getDetail(
    callback: (pengajuan: Pengajuan | null) => void
  ): Unsubscribe {
    try {
      const docRef = this.getDocRef();

      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          callback({
            id: docSnap.id,
            uid: data.uid,
            tipe: data.tipe,
            tanggal_pengajuan: data.tanggal_pengajuan,
            status: data.status,
            detail: {
              keterangan: data.keterangan,
              bukti_pendukung: data.bukti_pendukung,
              tanggal_mulai: data.tanggal_mulai,
              tanggal_berakhir: data.tanggal_berakhir,
            },
            created_at: data.created_at,
            updated_at: data.updated_at,
          });
        } else {
          callback(null);
        }
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error getting pengajuan detail realtime:", error);
      throw error;
    }
  }

  public async edit(): Promise<void> {
    try {
      const docRef = this.getDocRef();

      const updateData: any = {
        updated_at: Timestamp.now(),
      };

      if (this.keterangan) {
        updateData.keterangan = this.keterangan;
      }

      if (this.bukti_pendukung) {
        updateData.bukti_pendukung = this.bukti_pendukung;
      }

      if (this.tanggal_mulai) {
        updateData.tanggal_mulai = this.tanggal_mulai;
      }

      if (this.tanggal_berakhir) {
        updateData.tanggal_berakhir = this.tanggal_berakhir;
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error("Error editing pengajuan lembur:", error);
      throw error;
    }
  }
}
