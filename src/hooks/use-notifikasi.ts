import { useMutation } from "@tanstack/react-query";
import { NotifikasiServiceImpl } from "../data/data-sources/notifikasi-service-impl";

const notificationService = new NotifikasiServiceImpl();

export const useRegisterToken = () => {
  return useMutation({
    mutationFn: (uid: string) => {
      return notificationService.RegisterToken(uid);
    },
  });
};

export const useDeleteToken = () => {
  return useMutation({
    mutationFn: (uid: string) => {
      return notificationService.DeleteToken(uid);
    },
  });
};
