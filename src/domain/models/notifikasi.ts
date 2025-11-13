import { Timestamp } from "firebase/firestore";

export interface Notifikasi {
  id: string;
  body: string;
  created_at: Timestamp;
  read: boolean;
  title: string;
}
