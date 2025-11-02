import { TipePengajuan } from "@/src/common/enums/tipe-pengajuan";
import { PengajuanRepositoryImpl } from "@/src/data/repositories/pengajuan-repository-impl";
import { PengajuanSakit } from "@/src/domain/models/pengajuan_sakit";
import { IPengajuanRepository } from "@/src/domain/repositories/i-pengajuan-repository";
import { useCallback, useEffect, useRef, useState } from "react";

const useDetailPengajuanSakit = (uid?: string) => {
  const [selectedIdSakit, setSelectedIdSakit] = useState<string | null>(null);
  const [showDetailSheetSakit, setShowDetailSheetSakit] =
    useState<boolean>(false);
  const [detail, setDetail] = useState<PengajuanSakit | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const openDetailSakit = useCallback((id: string) => {
    setSelectedIdSakit(id);
    setShowDetailSheetSakit(true);
  }, []);

  const closeDetailSakit = useCallback(() => {
    setShowDetailSheetSakit(false);
    setSelectedIdSakit(null);
  }, []);

  const handleViewDetailSakitPress = useCallback(
    (itemOrId: { id: string } | string) => {
      const id = typeof itemOrId === "string" ? itemOrId : itemOrId.id;
      openDetailSakit(id);
    },
    [openDetailSakit]
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

    if (!uid || !selectedIdSakit) {
      setDetail(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const repo: IPengajuanRepository = new PengajuanRepositoryImpl();

    const unsub = repo.getDetail(uid, selectedIdSakit, (data) => {
      if (!data) {
        setDetail(null);
        setLoading(false);
        return;
      }

      const dDetail = data.detail || {};

      const mapped: PengajuanSakit = {
        id: data.id,
        uid: data.uid,
        tipe: data.tipe as TipePengajuan.sakit,
        tanggal_pengajuan: data.tanggal_pengajuan ?? "",
        status: data.status,
        detail: dDetail,
        created_at: data.created_at,
        updated_at: data.updated_at,
        keterangan: dDetail.keterangan ?? "",
        bukti_pendukung: dDetail.bukti_pendukung ?? "",
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
  }, [uid, selectedIdSakit]);

  return {
    loadingDetailSakit: loading,
    detailSakit: detail,
    showDetailSheetSakit,
    handleViewDetailSakitPress,
    closeDetailSakit,
  };
};

export default useDetailPengajuanSakit;
