import { StatusPengajuan } from "@/src/common/enums/status-pengajuan";
import { TipePengajuan } from "@/src/common/enums/tipe-pengajuan";
import { Unsubscribe } from "firebase/auth";
import { addDoc, onSnapshot, Timestamp, updateDoc } from "firebase/firestore";
import { PengajuanRepository } from "../../abstracts/pengajuan-abstract";
import { Pengajuan } from "../../models/pengajuan";

export class PengajuanSakitRepository extends PengajuanRepository {
  public async tambah(): Promise<void> {
    try {
      await addDoc(this.colRef, {
        uid: this.uid,
        tipe: TipePengajuan.sakit,
        tanggal_pengajuan: this.tanggal_pengajuan,
        status: StatusPengajuan.menunggu,
        keterangan: this.keterangan,
        bukti_pendukung: this.bukti_pendukung,
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

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error("Error editing pengajuan lembur:", error);
      throw error;
    }
  }
}
