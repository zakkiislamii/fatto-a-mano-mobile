import { UserRole } from "@/src/common/enums/user-role";
import { User } from "./user";

export interface Karyawan extends User {
  role: UserRole.karyawan;
}
