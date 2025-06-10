import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PlanModalContext = createContext();

export const PlanModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShowFreeTrialBanner, setIsShowFreeTrialBanner] = useState(false);
  const { userData } = useSelector((state) => state.user);

  const [utmId, setUtmId] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("utm_id");
    }
    return null;
  });

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const updateUtmId = (newId) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("utm_id", newId);
      setUtmId(newId);
    }
  };

  const removeUtmId = () => {
    if (typeof window !== "undefined") {
      localStorage.remove("utm_id");
    }
  };

  useEffect(() => {
    const isFreeTrial = userData?.isFreeTrial ?? null;
    const hasUtm = utmId !== null && utmId !== undefined;

    if (hasUtm || isFreeTrial) {
      setIsShowFreeTrialBanner(true);
    } else {
      setIsShowFreeTrialBanner(false);
    }
  }, [utmId, userData?.isFreeTrial]);

  return (
    <PlanModalContext.Provider
      value={{
        isOpen,
        openModal,
        closeModal,
        isShowFreeTrialBanner,
        setIsShowFreeTrialBanner,
        updateUtmId,
        removeUtmId,
      }}
    >
      {children}
    </PlanModalContext.Provider>
  );
};

export const usePlanModal = () => useContext(PlanModalContext);
