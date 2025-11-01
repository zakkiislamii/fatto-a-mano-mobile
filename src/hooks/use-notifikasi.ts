import { useMutation } from "@tanstack/react-query";
import { NotifikasiServiceImpl } from "../data/data-sources/notifikasi-service-impl";
import { INotifikasiService } from "../domain/services/i-notifikasi-service";

const notificationService: INotifikasiService = new NotifikasiServiceImpl();

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

export const useSendToKaryawan = () => {
  return useMutation({
    mutationFn: (uid: string) => {
      return notificationService.SendToKaryawan(uid);
    },
  });
};
