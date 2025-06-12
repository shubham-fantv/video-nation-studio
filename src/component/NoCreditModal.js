import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import { usePlanModal } from "../context/PlanModalContext";
import useGTM from "../hooks/useGTM";
import { getPageSubPage } from "../utils/common";
import { useEffect } from "react";

export default function NoCreditModal() {
  const { isNoCreditModalOpen, closeNoCreditModal } = usePlanModal();
  const router = useRouter();

  const { sendEvent, sendGTM } = useGTM();

  const seeAllPlans = () => {
    sendEvent({
      event: "button_clicked",
      button_text: "View All Plans",
      interaction_type: "Standard button",
      section_name: "Popup",
      button_id: "view_all_plan_sub_int_btn",
      ...getPageSubPage(router?.asPath),
    });
    closeNoCreditModal();
    router.push("/subscription");
  };

  useEffect(() => {
    if (isNoCreditModalOpen) {
      sendEvent({
        event: "popup_displayed",
        popup_type: "Nudge",
        popup_name: "Sub Intervention Popup",
        popup_messge_text: "Craft Stunning Visuals, Effortlessly",
        ...getPageSubPage(router?.asPath),
      });
    }
  }, [isNoCreditModalOpen]);

  const handleClose = () => {
    sendEvent({
      event: "button_clicked",
      button_text: "Cancel",
      interaction_type: "Standard button",
      section_name: "Popup",
      button_id: "cancel_sub_int_btn",
      ...getPageSubPage(router?.asPath),
    });
    closeNoCreditModal();
  };
  return (
    <Dialog
      open={isNoCreditModalOpen}
      onClose={closeNoCreditModal}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: "rounded-2xl p-4 bg-white text-black",
      }}
    >
      {/* <IconButton
        onClick={closeNoCreditModal}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <CloseIcon />
      </IconButton> */}

      <DialogTitle className="text-xl font-bold">Craft Stunning Visuals, Effortlessly</DialogTitle>

      <DialogContent>
        <p className="text-sm text-gray-600">
          Subscribe for top-quality AI video, image, headshot & luxury photo generation
        </p>
      </DialogContent>

      <DialogActions className="flex justify-between px-6 pb-4">
        <div></div>
        <div className="flex ">
          <button
            onClick={() => handleClose()}
            className="text-gray-500 text-sm font-medium hover:text-gray-700 pr-5"
          >
            Cancel
          </button>
          <button
            onClick={seeAllPlans}
            className="w-[150px] bg-gradient-to-r from-purple-600 to-pink-400 text-white px-5 py-2 text-sm font-semibold rounded-full shadow hover:from-purple-700 hover:to-pink-500 transition flex justify-center items-center"
          >
            View all plans
          </button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
