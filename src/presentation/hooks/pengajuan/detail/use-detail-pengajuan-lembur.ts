import { TipePengajuan } from "@/src/common/enums/tipe-pengajuan";
import { PengajuanLembur } from "@/src/common/types/pengajuan-lembur";
import { PengajuanLemburRepository } from "@/src/domain/repositories/pengajuan/pengajuan-lembur-repository";
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
    const repo = new PengajuanLemburRepository(uid);
    repo.setId(selectedIdLembur);

    const unsub = repo.getDetail((data) => {
      if (!data) {
        setDetail(null);
        setLoading(false);
        return;
      }

      const dDetail = data.detail || {};

      const mapped: PengajuanLembur = {
        id: data.id,
        uid: data.uid,
        tipe: data.tipe as TipePengajuan.lembur,
        tanggal_pengajuan: data.tanggal_pengajuan ?? "",
        status: data.status,
        detail: dDetail,
        created_at: data.created_at,
        updated_at: data.updated_at,
        keterangan: dDetail.keterangan ?? "",
        bukti_pendukung: dDetail.bukti_pendukung ?? "",
        durasi_lembur: dDetail.durasi_lembur ?? "",
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
