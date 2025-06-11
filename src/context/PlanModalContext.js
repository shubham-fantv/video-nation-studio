import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PlanModalContext = createContext();

export const PlanModalProvider = ({ children }) => {
  const router = useRouter();
  console.log("🚀 ~ PlanModalProvider ~ router:", router.query.utm_source);
  const [isOpen, setIsOpen] = useState(false);
  const [isTrialOpen, setIsTrialOpen] = useState(false);
  const [isNoCreditModalOpen, setIsNoCreditModalOpen] = useState(false);

  const [isShowFreeTrialBanner, setIsShowFreeTrialBanner] = useState(false);
  const { userData } = useSelector((state) => state.user);

  const [utmId, setUtmId] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("utm_id");
    }
    return null;
  });

  const openUpgradeModal = () => setIsOpen(true);
  const closeUpgradeModal = () => setIsOpen(false);

  const openTrialModal = () => setIsTrialOpen(true);
  const closeTrialModal = () => setIsTrialOpen(false);

  const openNoCreditModal = () => setIsNoCreditModalOpen(true);
  const closeNoCreditModal = () => setIsNoCreditModalOpen(false);

  const updateUtmId = (newId) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("utm_id", newId);
      setUtmId(newId);
    }
  };

  const removeUtmId = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("utm_id");
    }
  };

  useEffect(() => {
    const isFreeTrial = userData?.isFreeTrial ?? null;
    const isFreeTrialUsed = userData?.isFreeTrialUsed ?? null;
    const hasUtm = router?.query?.utm_source || (utmId !== null && utmId !== undefined);

    if (hasUtm || (isFreeTrial && !isFreeTrialUsed)) {
      setIsShowFreeTrialBanner(true);
    } else {
      setIsShowFreeTrialBanner(false);
    }
  }, [utmId, userData?.isFreeTrial, router?.query?.utm_source]);

  return (
    <PlanModalContext.Provider
      value={{
        isOpen,
        openUpgradeModal,
        closeUpgradeModal,

        isShowFreeTrialBanner,
        setIsShowFreeTrialBanner,
        updateUtmId,
        removeUtmId,

        openTrialModal,
        closeTrialModal,
        isTrialOpen,

        openNoCreditModal,
        closeNoCreditModal,
        isNoCreditModalOpen,
      }}
    >
      {children}
    </PlanModalContext.Provider>
  );
};

export const usePlanModal = () => useContext(PlanModalContext);
