import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/router";
import { usePlanModal } from "../context/PlanModalContext";
import { useMutation, useQuery } from "react-query";
import { FANTV_API_URL } from "../constant/constants";
import { useSnackbar } from "../context/SnackbarContext";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/slices/user";
import fetcher from "../dataProvider";
import { useEffect, useState } from "react";
import { getPageSubPage } from "../utils/common";

export default function PlanUpgradeModal() {
  const { isOpen, closeUpgradeModal } = usePlanModal();
  const router = useRouter();
  const { openSnackbar } = useSnackbar();
  const { isLoggedIn, userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const { refetch } = useQuery(
    `${FANTV_API_URL}/api/v1/users/${userData?._id || userData?.id}`,
    () => fetcher.get(`${FANTV_API_URL}/api/v1/users/${userData?._id || userData?.id}`),
    {
      enabled: !!(userData?._id || userData?.id),
      refetchOnMount: "always",
      onSuccess: ({ data }) => {
        dispatch(setUserData(data));
      },
    }
  );

  const { mutate: upgradeNow } = useMutation(
    (obj) => fetcher.post(`${FANTV_API_URL}/end-trial-and-upgrade`, obj),
    {
      onSuccess: (response) => {
        refetch();
        openSnackbar(
          "success",
          response?.message || "Trial ended and payment started successfully"
        );
        setIsLoading(false);
        closeUpgradeModal();
      },
      onError: ({ error }) => {
        openSnackbar("error", "Something went wrong, please try again later");
        setIsLoading(false);
        closeUpgradeModal();
      },
    }
  );

  const handleUpgrade = () => {
    setIsLoading(true);
    sendEvent({
      event: "button_clicked",
      button_text: "Upgrade",
      interaction_type: "Standard button",
      button_id: "free_trial_upgrade_btn",
      section_name: "Popup",
      ...getPageSubPage(router?.asPath),
    });
    upgradeNow({ isTrial: true });
  };

  const seeAllPlans = () => {
    closeUpgradeModal();

    sendEvent({
      event: "button_clicked",
      button_text: "View All Plans",
      interaction_type: "Standard button",
      button_id: "free_trial_upgrade_view_plans_btn",
      ...getPageSubPage(router?.asPath),
    });

    router.push("/subscription");
  };

  useEffect(() => {
    if (isOpen) {
      sendEvent({
        event: "popup_displayed",
        popup_type: "Nudge",
        popup_name: "Upgrade Free Trial",
        popup_messge_text: "Start your basic plan now to get all the features",
        ...getPageSubPage(router?.asPath),
      });
    }
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onClose={closeUpgradeModal}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: "rounded-2xl p-4 bg-white text-black",
      }}
    >
      {/* Close Button */}
      <IconButton
        onClick={closeUpgradeModal}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <CloseIcon />
      </IconButton>

      <DialogTitle className="text-xl font-bold">You are on Free Trial</DialogTitle>

      <DialogContent>
        <p className="text-sm text-gray-600">Start your Basic plan now to get all the features</p>
      </DialogContent>

      <DialogActions className="flex justify-between px-6 pb-4">
        <div></div>
        <div className="flex ">
          <button
            onClick={seeAllPlans}
            className="text-gray-500 text-sm font-medium hover:text-gray-700 pr-5"
          >
            See all plans
          </button>
          <button
            onClick={handleUpgrade}
            className="w-[150px] bg-gradient-to-r from-purple-600 to-pink-400 text-white px-5 py-2 text-sm font-semibold rounded-full shadow hover:from-purple-700 hover:to-pink-500 transition flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            ) : (
              "Upgrade Now"
            )}
          </button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
