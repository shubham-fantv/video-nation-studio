import { Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { FANTV_API_URL } from "../../constant/constants";
import { usePlanModal } from "../../context/PlanModalContext";
import fetcher from "../../dataProvider";
import useGTM from "../../hooks/useGTM";
import { styles } from "./style";
import useIsMobile from "../../hooks/useIsMobile";
import { useRouter } from "next/router";
import { getPageSubPage } from "../../utils/common";

const FreeTrial = ({ app }) => {
  const dispatch = useDispatch();
  const { isTrialOpen, closeTrialModal } = usePlanModal();
  const router = useRouter();
  const { sendEvent, sendGTM } = useGTM();
  const [subscriptions, setSubscriptions] = useState([]);
  const isMobile = useIsMobile(app?.deviceParsedInfo?.device?.isMobile);
  useQuery(
    `${FANTV_API_URL}/api/v1/subscription-plans`,
    () => fetcher.get(`${FANTV_API_URL}/api/v1/subscription-plans`),
    {
      enabled: isTrialOpen,
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
    sendGTM({
      event: "trialInitiatedVN",
      plan_type: subscriptions?.[0]?.planName,
      plan_duration: subscriptions?.[0]?.billedType,
    });
    sendEvent({
      event: "trial_initiated",
      plan_id: "Basic",
      plan_type: subscriptions?.[0]?.planName,
      text: "Start Trial",
      source: "popup",
      ...getPageSubPage(router?.asPath),
    });

    const requestBody = {
      subscriptionPlanId: subscriptions?.[0]?._id,
      isTrial: true,
    };
    initiatePayment(requestBody);
  };

  useEffect(() => {
    if (isTrialOpen) {
      sendEvent({
        event: "popup_displayed",
        page_name: "Free Trial",
        sub_page: "Banner",
        popup_type: "Nudge",
        popup_name: "Free Trial",
        popup_messge_text: "Start creating like a pro, free for 3 days",
        ...getPageSubPage(router?.asPath),
      });
    }
  }, [isTrialOpen]);

  const handleClose = () => {
    sendEvent({
      event: "button_clicked",
      button_text: "X",
      interaction_type: "Cross button",
      button_id: "free_trial_exit_btn",
      ...getPageSubPage(router?.asPath),
    });
    closeTrialModal();
  };
  return (
    <>
      <Modal
        style={{ zIndex: "9999", backdropFilter: "blur(44px)", blur: "40px" }}
        open={isTrialOpen}
        onClose={closeTrialModal}
        closeAfterTransition
      >
        <div style={styles.wrapper}>
          <div className="w-[90%] mx-auto p-4 md:p-6 bg-gray-100 rounded-3xl">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-base font-semibold text-[#1E1E1E] mb-2">
                  Start Creating Like a Pro
                </h1>
                <p className="text-[#626262] text-sm">
                  Cancel anytime, secure sign up
                </p>
                <div className="rounded-[8px] border-[1.5px] py-2 mt-2 w-full border-[#D0CCFF] bg-[#EFEEFF]">
                  <ul className="list-disc list-inside">
                    <li className="text-[#6B61FF] font-medium text-[12px] leading-[18px] font-inter not-italic px-2 ">
                      We charge $1 for verification & refund it shortly
                    </li>
                    <li className="text-[#6B61FF] font-medium text-[12px] leading-[18px] font-inter not-italic px-2 ">
                      Trial starts, cancel anytime.
                    </li>
                  </ul>
                </div>
              </div>
              <div
                onClick={() => handleClose()}
                className="text-3xl font-bold text-[#653EFF] cursor-pointer"
              >
                <img src="/images/icons/close-circle.svg" />
              </div>
            </div>
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
                  <div className="text-sm">2. 3 Videos</div>
                  <div className="text-sm">
                    3. Full Access to the exclusive Image Studio
                  </div>
                  <div className="text-sm">
                    4. Full Access to the exclusive Video Studio
                  </div>
                  <div className="text-sm">5. Unlimited HD downloads</div>
                </div>

                {/* Start Trial Button */}
                <button
                  onClick={() => handleStartTrial()}
                  className="bg-white w-full md:w-auto text-gray-900 px-6 py-3 font-base font-semibold  rounded-full text-xl font-semibold hover:bg-gray-100 transition-colors"
                >
                  Start Trial
                </button>

                {!isMobile && (
                  <p className="text-[] mt-4 text-xs">
                    Trial ends after 3 days
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FreeTrial;
