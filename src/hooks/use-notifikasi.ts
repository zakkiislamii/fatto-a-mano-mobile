import { useMutation } from "@tanstack/react-query";
import { NotifikasiService } from "../data/data-sources/notifikasi-service";

export const useRegisterToken = () => {
  return useMutation({
    mutationFn: (uid: string) => {
      const notificationService = new NotifikasiService(uid);
      return notificationService.RegisterToken();
    },
  });
};

export const useDeleteToken = () => {
  return useMutation({
    mutationFn: (uid: string) => {
      const notificationService = new NotifikasiService(uid);
      return notificationService.DeleteToken();
    },
  });
};
