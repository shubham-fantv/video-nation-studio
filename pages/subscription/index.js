import React, { useState } from "react";
import fetcher from "../../src/dataProvider";
import { useMutation, useQuery } from "react-query";
import { FANTV_API_URL } from "../../src/constant/constants";
import { useSelector } from "react-redux";
import useGTM from "../../src/hooks/useGTM";
const PricingPlans = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      isCurrentPlan: true,
      buttonText: "Current Plan",
      buttonStyle: "bg-gray-400 text-black cursor-default",
      features: ["Lorem ipsum dolor sit", "Lorem ipsum dolor sit", "Lorem ipsum dolor sit"],
    },
    {
      name: "Plus",
      price: "$40",
      billedMonthly: true,
      buttonText: "Choose Plan",
      buttonStyle: "bg-white text-black hover:bg-gray-100",
      features: ["Lorem ipsum dolor sit", "Lorem ipsum dolor sit", "Lorem ipsum dolor sit"],
    },
    {
      name: "Pro",
      price: "$50",
      billedMonthly: true,
      buttonText: "Choose Plan",
      buttonStyle: "bg-white text-black hover:bg-gray-100",
      isHighlighted: true,
      features: ["Lorem ipsum dolor sit", "Lorem ipsum dolor sit", "Lorem ipsum dolor sit"],
    },
    {
      name: "Pro Max",
      price: "$80",
      billedMonthly: true,
      buttonText: "Choose Plan",
      buttonStyle: "bg-white text-black hover:bg-gray-100",
      features: ["Lorem ipsum dolor sit", "Lorem ipsum dolor sit", "Lorem ipsum dolor sit"],
    },
  ];

  const [subscriptions, setSubscriptions] = useState([]);

  const { userData } = useSelector((state) => state.user);
  const { sendEvent } = useGTM();

  const [billingCycle, setBillingCycle] = useState("monthly");

  const filteredPlans = subscriptions?.filter((plan) => plan.billedType === billingCycle);

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

  const handleChoosePlan = (plan) => {
    const requestBody = {
      subscriptionPlanId: plan._id,
    };
    sendEvent({
      event: "Choose Plan (Initiate Checkout)",
      email: userData?.email,
      name: userData?.name,
      planId: plan._id,
    });

    initiatePayment(requestBody);
  };
  return (
    <div className=" text-black min-h-screen flex flex-col items-center py-1">
      <h1 className="text-[32px] font-bold mb-2">Plans That Fit Your Needs</h1>
      <p className="text-xl mb-4 text-[#1E1E1EB2]">VideoNation Creator Studio</p>

      {/* 🔄 Toggle Switch */}
      <div className="flex mb-8 bg-gray-200 rounded-full p-1">
        <button
          onClick={() => setBillingCycle("monthly")}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
            billingCycle === "monthly" ? "bg-[#1E1E1E] text-white" : "text-gray-700"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingCycle("yearly")}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
            billingCycle === "yearly" ? "bg-[#1E1E1E] text-white" : "text-gray-700"
          }`}
        >
          Yearly
        </button>
      </div>

      <div className="relative w-full px-4">
        {/* Optional: Display badge only if at least one plan is highlighted */}
        {filteredPlans.findIndex((plan) => plan.isHighlighted) >= 0 && (
          <div
            className="absolute z-10"
            style={{ top: "-25px", left: "50%", transform: "translateX(-135px)" }}
          >
            {/* Optional decorative badge */}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlans?.map((plan, index) => (
            <div
              key={index}
              className={`rounded-lg p-8 flex flex-col relative transition-all ${
                plan.isHighlighted
                  ? "bg-[#FFFFFF0D] text-black border-2 border-blue-400 shadow-lg"
                  : "bg-[#FFFFFF0D] text-black border border-[#FFFFFF26] shadow"
              }`}
            >
              {/* Optional “Most Popular” badge */}
              {plan.isHighlighted && (
                <div className="absolute top-[-15px] right-[-10px] bg-amber-400 text-black text-xs font-bold px-2 py-1 rounded shadow-md">
                  Most Popular
                </div>
              )}

              <h2 className="text-2xl font-bold mb-2">{plan.planName}</h2>

              <div className="mb-8">
                <span className="text-xl cursor-pointer" onClick={() => handleChoosePlan(plan)}>
                  ${plan.cost}/{billingCycle === "monthly" ? "month" : "year"}
                </span>
                {plan.billedType && (
                  <p className="text-sm text-gray-400">Billed {plan.billedType}</p>
                )}
              </div>

              <button
                onClick={() => handleChoosePlan(plan)}
                className="py-2 px-2 rounded-md mb-4 font-medium bg-[#1E1E1E] text-white hover:brightness-110"
              >
                Choose Plan
              </button>

              <ul className="space-y-2">
                {plan?.benefits?.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
