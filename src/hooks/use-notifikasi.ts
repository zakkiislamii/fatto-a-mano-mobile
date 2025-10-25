import { useMutation } from "@tanstack/react-query";
import { NotifikasiService } from "../domain/services/notifikasi-service";

const notificationService = new NotifikasiService();

export const useRegisterToken = () => {
  return useMutation({
    mutationFn: (uid: string) => notificationService.RegisterToken(uid),
  });
};

export const useDeleteToken = () => {
  return useMutation({
    mutationFn: (uid: string) => notificationService.DeleteToken(uid),
  });
};
