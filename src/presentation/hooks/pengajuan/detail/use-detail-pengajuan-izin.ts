import { TipePengajuan } from "@/src/common/enums/tipe-pengajuan";
import { PengajuanIzin } from "@/src/common/types/pengajuan_izin";
import { PengajuanIzinRepository } from "@/src/domain/repositories/pengajuan/pengajuan-izin-repository";
import { useCallback, useEffect, useRef, useState } from "react";

const useDetailPengajuanIzin = (uid?: string) => {
  const [selectedIdIzin, setSelectedIdIzin] = useState<string | null>(null);
  const [showDetailSheetIzin, setShowDetailSheet] = useState<boolean>(false);
  const [detail, setDetail] = useState<PengajuanIzin | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const openDetailIzin = useCallback((id: string) => {
    setSelectedIdIzin(id);
    setShowDetailSheet(true);
  }, []);

  const closeDetailIzin = useCallback(() => {
    setShowDetailSheet(false);
    setSelectedIdIzin(null);
  }, []);

  const handleViewDetailPress = useCallback(
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
    const repo = new PengajuanIzinRepository(uid);
    repo.setId(selectedIdIzin);

    const unsub = repo.getDetail((data) => {
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
    selectedIdIzin,
    showDetailSheetIzin,
    handleViewDetailPress,
    openDetailIzin,
    closeDetailIzin,
  };
};

export default useDetailPengajuanIzin;
