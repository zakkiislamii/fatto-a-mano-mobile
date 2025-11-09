import { TipePengajuan } from "@/src/common/enums/tipe-pengajuan";
import { PengajuanRepositoryImpl } from "@/src/data/repositories/pengajuan-repository-impl";
import { PengajuanLembur } from "@/src/domain/models/pengajuan-lembur";
import { IPengajuanRepository } from "@/src/domain/repositories/i-pengajuan-repository";
import { useCallback, useEffect, useRef, useState } from "react";

const useDetailPengajuanLembur = (uid?: string) => {
  const [selectedIdLembur, setSelectedIdLembur] = useState<string | null>(null);
  const [showDetailSheetLembur, setShowDetailSheetLembur] =
    useState<boolean>(false);
  const [detail, setDetail] = useState<PengajuanLembur | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const openDetailLembur = useCallback((id: string) => {
    setSelectedIdLembur(id);
    setShowDetailSheetLembur(true);
  }, []);

  const closeDetailLembur = useCallback(() => {
    setShowDetailSheetLembur(false);
    setSelectedIdLembur(null);
  }, []);

  const handleViewDetailLemburPress = useCallback(
    (itemOrId: { id: string } | string) => {
      const id = typeof itemOrId === "string" ? itemOrId : itemOrId.id;
      openDetailLembur(id);
    },
    [openDetailLembur]
  );

  useEffect(() => {
    if (unsubscribeRef.current) {
      try {
        unsubscribeRef.current();
      } catch (e) {
        console.error(e);
      }
      unsubscribeRef.current = null;
    }

    if (!uid || !selectedIdLembur) {
      setDetail(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const repo: IPengajuanRepository = new PengajuanRepositoryImpl();

    const unsub = repo.getDetail(uid, selectedIdLembur, (data) => {
      if (!data) {
        setDetail(null);
        setLoading(false);
        return;
      }

      if (data.tipe !== TipePengajuan.LEMBUR) {
        setDetail(null);
        setLoading(false);
        return;
      }

      const lemburData = data as PengajuanLembur;

      setDetail(lemburData);
      setLoading(false);
    });

    unsubscribeRef.current = unsub;

    return () => {
      if (unsubscribeRef.current) {
        try {
          unsubscribeRef.current();
        } catch (e) {
          console.error(e);
        }
        unsubscribeRef.current = null;
      }
    };
  }, [uid, selectedIdLembur]);

  return {
    loadingDetailLembur: loading,
    detailLembur: detail,
    showDetailSheetLembur,
    handleViewDetailLemburPress,
    closeDetailLembur,
  };
};

export default useDetailPengajuanLembur;
