import { Timestamp } from "firebase/firestore";

export interface Notifikasi {
  id: string;
  body: string;
  createdAt: Timestamp;
  read: boolean;
  title: string;
}
