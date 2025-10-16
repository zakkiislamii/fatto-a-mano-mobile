import { UserRole } from "@/src/enums/role";
import { User } from "./user";

export interface Karyawan extends User {
  role: UserRole.karyawan;
}
