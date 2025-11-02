import { TipePengajuan } from "@/src/common/enums/tipe-pengajuan";
import { PengajuanRepositoryImpl } from "@/src/data/repositories/pengajuan-repository-impl";
import { PengajuanIzin } from "@/src/domain/models/pengajuan_izin";
import { IPengajuanRepository } from "@/src/domain/repositories/i-pengajuan-repository";
import { useCallback, useEffect, useRef, useState } from "react";

const useDetailPengajuanIzin = (uid?: string) => {
  const [selectedIdIzin, setSelectedIdIzin] = useState<string | null>(null);
  const [showDetailSheetIzin, setShowDetailSheetIzin] =
    useState<boolean>(false);
  const [detail, setDetail] = useState<PengajuanIzin | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const openDetailIzin = useCallback((id: string) => {
    setSelectedIdIzin(id);
    setShowDetailSheetIzin(true);
  }, []);

  const closeDetailIzin = useCallback(() => {
    setShowDetailSheetIzin(false);
    setSelectedIdIzin(null);
  }, []);

  const handleViewDetailIzinPress = useCallback(
    (itemOrId: { id: string } | string) => {
      const id = typeof itemOrId === "string" ? itemOrId : itemOrId.id;
      openDetailIzin(id);
    },
    [openDetailIzin]
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

    if (!uid || !selectedIdIzin) {
      setDetail(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const repo: IPengajuanRepository = new PengajuanRepositoryImpl();

    const unsub = repo.getDetail(uid, selectedIdIzin, (data) => {
      if (!data) {
        setDetail(null);
        setLoading(false);
        return;
      }

      const dDetail = data.detail || {};

      const mapped: PengajuanIzin = {
        id: data.id,
        uid: data.uid,
        tipe: data.tipe as TipePengajuan.izin,
        tanggal_pengajuan: data.tanggal_pengajuan ?? "",
        status: data.status,
        detail: dDetail,
        created_at: data.created_at,
        updated_at: data.updated_at,
        keterangan: dDetail.keterangan ?? "",
        bukti_pendukung: dDetail.bukti_pendukung ?? "",
        tanggal_mulai: dDetail.tanggal_mulai ?? "",
        tanggal_berakhir: dDetail.tanggal_berakhir ?? "",
      };

      setDetail(mapped);
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
  }, [uid, selectedIdIzin]);

  return {
    loadingDetailIzin: loading,
    detailIzin: detail,
    showDetailSheetIzin,
    handleViewDetailIzinPress,
    closeDetailIzin,
  };
};

export default useDetailPengajuanIzin;
