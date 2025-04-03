import React, { useEffect } from "react";
import get from "lodash/get";
import fetcher from "../../src/dataProvider";
import { useRouter } from "next/router";

const index = () => {
  const router = useRouter();

  const checkToken = async (token) => {
    let data = await fetcher.get(`verify-payment?session_id=${token}`);
    console.log("🚀 ~ checkToken ~ data:", data);

    // if (data.status == 204) {
    // } else {
    // }
    // router.push("/");
  };

  useEffect(() => {
    const token = get(router, "query.session_id", null);
    if (!!token) {
      checkToken(token);
    }
  }, [router]);

  return <div className="text-white">Payment Success</div>;
};

export default index;
