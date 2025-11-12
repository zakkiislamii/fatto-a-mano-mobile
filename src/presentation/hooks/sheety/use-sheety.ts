import { SheetyServiceImpl } from "@/src/data/data-sources/sheety-service-impl";
import { Sheety } from "@/src/domain/models/sheety";
import { ISheetyService } from "@/src/domain/services/i-sheety-service";
import { useMutation } from "@tanstack/react-query";

const sheetyService: ISheetyService = new SheetyServiceImpl();

export const useEditRow = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Sheety> }) => {
      return sheetyService.editRow(id, data);
    },
  });
};
