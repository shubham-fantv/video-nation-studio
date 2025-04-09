import React, { useState } from "react";
import fetcher from "../../src/dataProvider";
import { useMutation, useQuery } from "react-query";
import { FANTV_API_URL } from "../../src/constant/constants";
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

  useQuery(
    `${FANTV_API_URL}/api/v1/subscription-plans`,
    () => fetcher.get(`${FANTV_API_URL}/api/v1/subscription-plans`),
    {
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
    initiatePayment(requestBody);
  };
  return (
    <div className=" text-white min-h-screen flex flex-col items-center py-16">
      <h1 className="text-4xl font-bold mb-2">Plans That Fit Your Needs</h1>
      <p className="text-xl mb-12 text-gray-300">VideoNation Creator Studio</p>

      <div className="relative w-full max-w-6xl px-4">
        {/* Blue Circle Badge */}
        {plans.findIndex((plan) => plan.isHighlighted) >= 0 && (
          <div
            className="absolute z-10"
            style={{ top: "-25px", left: "50%", transform: "translateX(-135px)" }}
          ></div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {subscriptions?.map((plan, index) => (
            <div
              key={index}
              className={`bg-[#FFFFFF0D] rounded-lg p-8 flex flex-col relative ${
                plan.isHighlighted ? "z-0" : ""
              }`}
              style={{ border: "1px solid #FFFFFF26" }}
            >
              <h2 className="text-4xl font-bold mb-2">{plan.planName}</h2>
              <div className="mb-8">
                <span className="text-xl">{plan.cost}/month</span>
                {plan.billedType && (
                  <p className="text-sm text-gray-400">Billed {plan.billedType}</p>
                )}
              </div>

              <button
                onClick={() => handleChoosePlan(plan)}
                className={`py-3 px-4 rounded-md mb-8 font-medium bg-white text-black hover:bg-gray-100`}
              >
                Choose Plan
              </button>

              <ul className="space-y-4">
                {plan?.benefits?.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <span className="mr-2 mt-1">•</span>
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
