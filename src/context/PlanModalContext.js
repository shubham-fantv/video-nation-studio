// context/PlanModalContext.js
import { createContext, useContext, useState } from "react";

const PlanModalContext = createContext();

export const PlanModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <PlanModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </PlanModalContext.Provider>
  );
};

export const usePlanModal = () => useContext(PlanModalContext);
