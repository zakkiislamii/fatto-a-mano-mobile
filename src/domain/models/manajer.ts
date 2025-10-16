import { UserRole } from "@/src/enums/role";
import { User } from "./user";

export interface Manajer extends User {
  role: UserRole.manager;
}
