import React, { useState, useEffect } from "react";
import fetcher from "../../src/dataProvider";
import { useMutation, useQuery } from "react-query";
import { FANTV_API_URL } from "../../src/constant/constants";
import { useSelector } from "react-redux";
import useGTM from "../../src/hooks/useGTM";
import LoginAndSignup from "../../src/component/feature/Login";
import { getPageSubPage } from "../../src/utils/common";
const PricingPlans = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);

  const { userData, isLoggedIn } = useSelector((state) => state.user);
  const { sendEvent, sendGTM } = useGTM();
  const [billingCycle, setBillingCycle] = useState("monthly");

  const filteredPlans = subscriptions?.filter((plan) => plan.billedType === billingCycle);

  const [userSubscriptionData, setUserSubscriptionData] = useState([]);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  const [currentPlanPriority, setcurrentPlanPriority] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [timeLeft, setTimeLeft] = useState("");
  const [trialPlan, setTrialPlan] = useState();

  useQuery(
    `${FANTV_API_URL}/api/v1/subscription-plans`,
    () => fetcher.get(`${FANTV_API_URL}/api/v1/subscription-plans`),
    {
      refetchOnMount: "always",
      onSuccess: ({ data }) => {
        const trialObj = data.filter((item) => item.isTrialPlan);
        console.log("🚀 ~ PricingPlans ~ trialObj:", trialObj);
        setSubscriptions(data);
      },
    }
  );

  useQuery(
    `${FANTV_API_URL}/api/v1/user-subscriptions/${userData?._id || userData?.id}`,
    () =>
      fetcher.get(`${FANTV_API_URL}/api/v1/user-subscriptions/${userData?._id || userData?.id}`),
    {
      enabled: !!(userData?._id || userData?.id),
      refetchOnMount: "always",
      onSuccess: ({ data }) => {
        setUserSubscriptionData(data);
      },
    }
  );

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      setcurrentPlanPriority(userSubscriptionData?.subscriptionPlanId?.planNumber);

      if (!userSubscriptionData || userSubscriptionData.length === 0) {
        const startDate = new Date(userData?.created_at);
        const promoEndsAt = new Date(startDate.getTime() + 1 * 60 * 60 * 1000); // ⏱️ 1 hour from signup

        const diff = promoEndsAt - now;

        if (diff > 0) {
          setIsNewCustomer(true);
          setPromoCode("NEW50");
          setDiscount(0.5);
        } else {
          setTimeLeft("Expired");
          return;
        }

        const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0");
        const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

        const hours = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, "0");

        if (hours === "00") {
          setTimeLeft(`${minutes}m ${seconds}s`);
        } else {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        }
      }
    };

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(interval);
  }, [userSubscriptionData]);

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

  const handleChoosePlan = (plan) => {
    // if (isDowngrade) {
    //   const confirm = window.confirm("Are you sure you want to downgrade? Your existing features may be limited.");
    //   if (!confirm) return;
    // }

    const requestBody = {
      subscriptionPlanId: plan._id,
      ...(promoCode && promoCode !== "" && { promoCode }),
    };
    if (isLoggedIn) {
      sendGTM({
        event: plan?.isTrialPlan ? "trialInitiatedVN" : "subscriptionInitiatedVN",
        plan_type: plan?.planName,
        plan_duration: plan?.billedType,
      });
      if (plan?.isTrialPlan) {
        sendEvent({
          event: "trial_initiated",
          plan_id: "Basic",
          plan_type: plan?.planName,
          text: "Choose Plan",
          source: "popup",
          page_name: "Subscription",
        });
      } else {
        sendEvent({
          event: "subscription_initiated",
          plan_type: plan?.planName,
          plan_duration: plan?.billedType,
          page_name: "Subscription",
        });
      }
      initiatePayment(requestBody);
    } else {
      setIsPopupVisible(true);
    }
  };

  const handleMonthly = () => {
    setBillingCycle("monthly");
    sendEvent({
      event: "button_clicked",
      button_text: "Monthly",
      page_name: "Subscription",
      interaction_type: "Toggle Button",
      section_name: "Header",
      button_id: "sub_billing_period_toggle_btn",
    });
  };
  const handleYearly = () => {
    setBillingCycle("yearly");
    sendEvent({
      event: "button_clicked",
      button_text: "Yearly",
      page_name: "Subscription",
      interaction_type: "Toggle Button",
      section_name: "Header",
      button_id: "sub_billing_period_toggle_btn",
    });
  };

  return (
    <div className=" text-black min-h-screen flex flex-col items-center py-1">
      <h1 className="text-[32px] font-bold mb-2 text-center">Plans That Fit Your Needs</h1>
      <p className="text-xl mb-4 text-[#1E1E1EB2]">VideoNation Creator Studio</p>

      {/* 🔄 Toggle Switch */}
      <div className="flex mb-8 bg-gray-200 rounded-full p-1 relative">
        <button
          onClick={() => handleMonthly()}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
            billingCycle === "monthly" ? "bg-[#1E1E1E] text-white" : "text-gray-700"
          }`}
        >
          Monthly
        </button>

        <div className="relative">
          <button
            onClick={() => handleYearly()}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              billingCycle === "yearly" ? "bg-[#1E1E1E] text-white" : "text-gray-700"
            }`}
          >
            Yearly
          </button>

          {/* -20% OFF badge */}
          <span className="absolute -top-2 -right-6 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            -20%
          </span>
        </div>
      </div>
      <div className="relative w-full px-4">
        {filteredPlans.findIndex((plan) => plan.isHighlighted) >= 0 && (
          <div
            className="absolute z-10"
            style={{ top: "-25px", left: "50%", transform: "translateX(-135px)" }}
          ></div>
        )}

        <div
          className={`grid grid-cols-1 md:grid-cols-2 ${
            userData?.isFreeTrial || userData?.isFreeTrialUsed ? "lg:grid-cols-4" : "lg:grid-cols-3"
          } gap-3`}
        >
          {filteredPlans?.map((plan, index) => {
            const isCurrentPlan =
              !!userSubscriptionData && userSubscriptionData.subscriptionPlanId?._id === plan._id;

            let isUpgrade = false;
            let isDowngrade = false;

            // if (!userData?.isTrialUser && userSubscriptionData?.subscriptionPlanId) {
            //   isUpgrade = plan.planNumber > currentPlanPriority;
            //   isDowngrade = plan.planNumber < currentPlanPriority;
            // }

            return (
              <div
                key={index}
                className={`rounded-lg p-6 flex flex-col relative transition-all ${
                  isCurrentPlan
                    ? "bg-green-100 border-2 border-green-200 shadow-xl"
                    : plan.isHighlighted
                    ? "bg-[#F5F5F5] border border-gray-400 shadow-xl"
                    : "bg-[#F5F5F5] border border-gray-400 shadow-xl"
                } ${plan?.isTrialPlan ? "text-white" : "text-black"}`}
                style={{
                  background: plan?.isTrialPlan
                    ? "linear-gradient(180deg, #653EFF 0%, #FFA0FF 100%)"
                    : "#F5F5F5",
                }}
              >
                {isCurrentPlan && (
                  <div className="absolute top-[-15px] left-[-10px] bg-gray-700 text-white text-xs font-bold px-2 py-1 rounded shadow-md z-10">
                    Your Plan
                  </div>
                )}

                {/* {plan.isHighlighted && (
                  <div className="absolute top-[-15px] right-[-10px] bg-amber-400 text-black text-xs font-bold px-2 py-1 rounded shadow-md">
                    Most Popular
                  </div>
                )} */}

                <h2 className="text-xl font-bold mb-2">{plan.planName}</h2>

                <div className="mb-8">
                  <span>
                    $
                    {billingCycle === "yearly" ? (
                      <>
                        <span className="text-xl font-bold">
                          {isNewCustomer
                            ? ((plan.cost * discount) / 12).toFixed(2)
                            : (plan.cost / 12).toFixed(2)}
                          /month
                        </span>
                        {!plan.isTrialPlan && (
                          <span className="text-sm ml-2">
                            (<s>${plan?.actual_cost?.toFixed(2)}</s>)
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="text-xl font-bold">
                          {isNewCustomer && !plan.isTrialPlan
                            ? (plan.cost * discount).toFixed(2)
                            : plan.cost.toFixed(2)}
                          /month
                        </span>
                        {isNewCustomer && !plan.isTrialPlan && (
                          <span className="text-sm  ml-2">
                            <s>(${plan.cost.toFixed(2)})</s>
                          </span>
                        )}
                      </>
                    )}
                  </span>

                  {plan.isTrialPlan && timeLeft !== "Expired" ? (
                    <div className="text-sm font-medium text-white mt-2">
                      83% of users choose this plan
                    </div>
                  ) : (
                    isNewCustomer &&
                    timeLeft !== "Expired" && (
                      <div className="text-sm font-medium text-green-600 mt-2">
                        ⏰ {discount * 100}% OFF ends in:{" "}
                        <span className="font-mono">{timeLeft}</span>
                      </div>
                    )
                  )}

                  {plan.billedType && <p className="text-sm  mt-2">Billed {plan.billedType}</p>}
                </div>

                {isCurrentPlan && userData?.isTrialUser ? (
                  <button
                    disabled
                    className="py-2 px-2 rounded-md mb-4 font-medium bg-gray-400 text-white cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleChoosePlan(plan)}
                    className={`py-2 px-2 rounded-md mb-4 font-medium ${
                      !userSubscriptionData?.subscriptionPlanId || userData?.isTrialUser
                        ? "bg-blue-600" // new/trial user default
                        : isUpgrade
                        ? "bg-[#1E1E1E]"
                        : "bg-yellow-600"
                    } text-white hover:brightness-110`}
                  >
                    {!userSubscriptionData?.subscriptionPlanId || userData?.isTrialUser
                      ? "Choose Plan"
                      : isUpgrade
                      ? "Choose Plan"
                      : "Choose Plan"}
                  </button>
                )}

                <ul className="space-y-2">
                  {plan?.benefits?.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
      {isPopupVisible && (
        <LoginAndSignup
          callBackName={"uniqueCommunity"}
          open={isPopupVisible}
          handleModalClose={() => setIsPopupVisible(false)}
        />
      )}
    </div>
  );
};

export default PricingPlans;
