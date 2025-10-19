import { UserRole } from "@/src/common/enums/user-role";
import { User } from "@/src/domain/models/user";

export interface Manajer extends User {
  role: UserRole.manajer;
}
