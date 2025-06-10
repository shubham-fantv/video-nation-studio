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

export default function PlanUpgradeModal() {
  const { isOpen, closeModal } = usePlanModal();
  const router = useRouter();
  const { openSnackbar } = useSnackbar();
  const { isLoggedIn, userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

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
      },
      onError: ({ error }) => {
        openSnackbar("error", "Something went wrong, please try again later");
      },
    }
  );

  const handleUpgrade = () => {
    closeModal();

    upgradeNow({ isTrial: true });
  };

  const seeAllPlans = () => {
    closeModal();
    router.push("/subscription");
  };

  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: "rounded-2xl p-4 bg-white text-black",
      }}
    >
      {/* Close Button */}
      <IconButton
        onClick={closeModal}
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
            className="bg-gradient-to-r from-purple-600 to-pink-400 text-white px-5 py-2 text-sm font-semibold rounded-full shadow hover:from-purple-700 hover:to-pink-500 transition"
          >
            Upgrade Now
          </button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
