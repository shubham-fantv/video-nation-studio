import { Box, Modal } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import { useMutation, useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { setToken, setUserData } from "../../redux/slices/user";
import loginData from "../../utils/login";
import { styles } from "./style";
import useGTM from "../../hooks/useGTM";
import { API_BASE_URL, FANTV_API_URL } from "../../constant/constants";
import fetcher from "../../dataProvider";
import { useState } from "react";

const FreeTrial = ({ open, handleModalClose }) => {
  const dispatch = useDispatch();
  const { sendEvent } = useGTM();
  const [subscriptions, setSubscriptions] = useState([]);

  useQuery(
    `${FANTV_API_URL}/api/v1/subscription-plans`,
    () => fetcher.get(`${FANTV_API_URL}/api/v1/subscription-plans`),
    {
      refetchOnMount: "always",
      onSuccess: ({ data }) => {
        setSubscriptions(data);
      },
    }
  );
  const { mutate: initiatePayment } = useMutation(
    (obj) => fetcher.post(`${FANTV_API_URL}/create-checkout-session`, obj),
    {
      onSuccess: (response) => {
        window.location.href = response.url;
      },
      onError: (error) => {
        alert(error.response.data.message);
      },
    }
  );

  const handleStartTrial = () => {
    const requestBody = {
      subscriptionPlanId: subscriptions?.[0]?._id,
      isTrial: true,
    };
    // sendEvent({
    //   event: "subscription _initiated",
    //   plan_type: plan?.planName,
    //   plan_duration: plan?.billedType,
    // });
    initiatePayment(requestBody);
  };
  return (
    <>
      <Modal
        style={{ zIndex: "9999", backdropFilter: "blur(44px)", blur: "40px" }}
        open={open}
        onClose={handleModalClose}
        closeAfterTransition
      >
        <div style={styles.wrapper}>
          <div className="max-w-2xl mx-auto p-6 bg-gray-100 rounded-3xl">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-base font-semibold text-[#1E1E1E] mb-2">
                  Start Creating Like a Pro, Free for 7 Days
                </h1>
                <p className="text-[#626262] text-sm">Cancel anytime, secure sign up</p>
              </div>
              <div className="text-3xl font-bold text-[#653EFF]">
                <img src="/images/icons/close-circle.svg" />
              </div>
            </div>

            {/* Benefits Card */}
            {/* <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-blue-600 rounded-2xl p-4 text-white relative overflow-hidden"> */}
            <div
              className="w-full rounded-2xl overflow-hidden relative"
              style={{
                backgroundImage: 'url("/images/video-ai/trial-bg.png")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                border: " 2px solid #E4DDFF",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-between",
              }}
            >
              <div className="relative z-10 text-white p-4">
                <h2 className="text-base font-semibold mb-4">Benefits</h2>

                <div className="space-y-4 mb-4">
                  <div className="text-sm">1. 20 Images</div>
                  <div className="text-sm">2. 5 Videos</div>
                  <div className="text-sm">3. Full Access to the exclusive Image Studio</div>
                  <div className="text-sm">3. Full Access to the exclusive Video Studio</div>
                </div>

                {/* Start Trial Button */}
                <button
                  onClick={() => handleStartTrial()}
                  className="bg-white text-gray-900 px-6 py-3 font-base font-semibold  rounded-full text-xl font-semibold hover:bg-gray-100 transition-colors"
                >
                  Start Trial
                </button>

                <p className="text-[] mt-4 text-xs">Trial ends after 7 days</p>
              </div>
            </div>

            {/* Footer */}
            {/* <div className="flex justify-between items-center mt-6">
              <div className="bg-blue-400 text-white  rounded text-sm font-medium"></div>
              <button
                onClick={handleModalClose}
                className="text-gray-900 text-xl font-medium hover:text-gray-700 transition-colors"
              >
                Close
              </button>
            </div> */}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FreeTrial;
