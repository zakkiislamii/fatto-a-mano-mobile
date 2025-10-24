import { useState } from "react";

const ANIMATION_DELAY = 250;

const usePengajuanView = (
  openSakitSheet: () => void,
  openIzinSheet: () => void
) => {
  const [showPilihanSheet, setShowPilihanSheet] = useState<boolean>(false);

  const openSheet = () => {
    setShowPilihanSheet(true);
  };

  const closeSheet = () => {
    setShowPilihanSheet(false);
  };

  const handlePilihIzin = () => {
    setShowPilihanSheet(false);
    setTimeout(() => {
      openIzinSheet();
    }, ANIMATION_DELAY);
  };

  const handlePilihSakit = () => {
    setShowPilihanSheet(false);
    setTimeout(() => {
      openSakitSheet();
    }, ANIMATION_DELAY);
  };

  return {
    showPilihanSheet,
    handlePilihIzin,
    handlePilihSakit,
    openSheet,
    closeSheet,
  };
};

export default usePengajuanView;
