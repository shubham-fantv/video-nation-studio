import React, { useEffect } from "react";
import fetcher from "../../src/dataProvider";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import useGTM from "../../src/hooks/useGTM";

const index = () => {
  const router = useRouter();
  const { userData } = useSelector((state) => state.user);
  const { sendEvent } = useGTM();

  const checkToken = async (token) => {
    let data = await fetcher.get(`verify-payment?session_id=${token}`);

    if (data.status == 204) {
      sendEvent({
        event: "Subscribe",
        email: userData?.email,
        name: userData?.name,
      });
    } else {
    }
  };

  useEffect(() => {
    const token = router?.query?.session_id || null;
    if (!!token) {
      checkToken(token);
    }
  }, [router]);

  return (
    <div>
      <div className="flex pt-10 justify-center align-center text-2xl text-black">
        <div>
          <img src="/images/paymentdone.png" className="h-40 mb-5 ml-4" />
          Payment Success
        </div>
      </div>
      <div className="flex pt-3 justify-center align-center text-2xl text-black">
        <button
          size="small"
          className="mt-6 py-2 px-4 rounded-xl text-sm font-regular normal-case flex bg-[#1E1E1E]  text-[#FFFFFF] "
          onClick={() => router.push("/")}
        >
          Go to Home
          <img
            src="/images/video-ai/arrowRight.svg"
            style={{ height: "20px", width: "20px", marginLeft: "6px" }}
            className="text-white"
          />
        </button>
      </div>
    </div>
  );
};

export default index;
