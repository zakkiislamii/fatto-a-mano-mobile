import {
  EditProfilData,
  LengkapiProfilData,
} from "@/src/common/types/user-data";
import { ProfilKaryawan } from "@/src/domain/models/profil-karyawan";
import { Unsubscribe } from "firebase/firestore";
import { Karyawan } from "../models/karyawan";

export interface IUserRepository {
  getProfilRealTime(
    uid: string,
    cb: (data: ProfilKaryawan | null) => void
  ): Unsubscribe | null;
  editProfil(uid: string, data: EditProfilData): Promise<void>;
  updateLengkapiProfil(uid: string, data: LengkapiProfilData): Promise<void>;
  getLengkapiProfilRealTime(
    uid: string,
    cb: (isComplete: boolean) => void
  ): Unsubscribe | null;
  getAllKaryawanRealTime(
    cb: (data: Karyawan[] | null) => void
  ): Unsubscribe | null;
}
