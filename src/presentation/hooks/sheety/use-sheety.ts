import { SheetyServiceImpl } from "@/src/data/data-sources/sheety-service-impl";
import { Sheets } from "@/src/domain/models/sheets";
import { ISheetyService } from "@/src/domain/services/i-sheety-service";
import { useMutation, useQuery } from "@tanstack/react-query";

const sheetyService: ISheetyService = new SheetyServiceImpl();

export const useGetRows = () => {
  return useQuery({
    queryKey: ["sheety-rows"],
    queryFn: () => sheetyService.getRows(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAddRow = () => {
  return useMutation({
    mutationFn: (data: Sheets) => {
      return sheetyService.addRow(data);
    },
  });
};

export const useEditRow = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Sheets> }) => {
      return sheetyService.editRow(id, data);
    },
  });
};
