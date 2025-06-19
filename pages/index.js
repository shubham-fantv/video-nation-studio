import { Box, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

import { useQuery } from "react-query";
import CLink from "../src/component/CLink";
import CardComponent from "../src/component/CardComponent";
import CommunityCreatedContent from "../src/component/CommunityCreatedContent";
import Banner from "../src/component/banner";
import { FANTV_API_URL } from "../src/constant/constants";
import LoginAndSignup from "../src/component/feature/Login";
import fetcher from "../src/dataProvider";
import { parseCookies } from "nookies";
import { useSelector } from "react-redux";
import SweetAlert2 from "react-sweetalert2";
import ShimmerCategories from "../src/component/common/ShimmerCategories";
import useGTM from "../src/hooks/useGTM";
import Head from "next/head";

export function storeUTMParams() {
  const params = new URLSearchParams(window.location.search);
  ["utm_source", "utm_medium", "utm_campaign", "utm_id"].forEach((key) => {
    const val = params.get(key);
    if (val) localStorage.setItem(key, val);
  });
}

const Index = ({ isMobile }) => {
  const [swalProps, setSwalProps] = useState({});
  const [isPopupVisible, setIsPopupVisible] = useState({
    login: false,
  });
  const { isLoggedIn, userData } = useSelector((state) => state.user);
  const { sendEvent } = useGTM();
  const [homeFeedData, setHomeFeedData] = useState([]);

  const { isLoading } = useQuery(
    `${FANTV_API_URL}/api/v1/homefeed`,
    () => fetcher.get(`${FANTV_API_URL}/api/v1/homefeed?limit=50`),
    {
      refetchOnMount: "always",
      onSuccess: ({ data }) => {
        setHomeFeedData(data);
      },
    }
  );

  const handleConfirm = () => {
    //console.log(template);
  };

  const handleLoginPopupClose = () => {
    setIsPopupVisible({ login: false });
  };

  console.log("userData", "homepage");

  useEffect(() => {
    sendEvent({
      event: "land_on_home_page",
    });
    storeUTMParams();
    if (!isLoggedIn) {
      // setSwalProps({
      //   show: true,
      //   title: "⏳ Sign Up Now",
      //   text: `Sign up Now to get 50 Free Credits.`,
      //   confirmButtonText: "Sign Up",
      //   showCancelButton: true,
      //   icon: "info",
      //   preConfirm: () => {
      //     setIsPopupVisible({ login: true });
      //     sendEvent({
      //       event: "button_clicked",
      //       button_text: "Sign Up",
      //       page_name: "Home Page",
      //       interaction_type: "Standard button",
      //       button_id: "popup_signup_btn",
      //       section_name: "Popup",
      //     });
      //   },
      // });
      // sendEvent({
      //   event: "popup_displayed",
      //   popup_type: "Nudge",
      //   popup_name: "Sign Up Now",
      //   popup_messge_text: "Sign up Now to get 50 Free Credits.",
      //   page_name: "Home Page",
      // });
    }
    //console.log("homeFeed",JSON.stringify(homeFeedData));
  }, []);

  return (
    <div>
      <Head>
        <link
          rel="preload"
          as="video"
          href="https://assets.artistfirst.in/uploads/1749134836258-1745495375865-replicate-prediction-rp7g44c4hdrmc0cpcxqskk3v18_compressed.mp4"
          type="video/mp4"
        />
        <link
          rel="preload"
          as="video"
          href="https://assets.artistfirst.in/uploads/1749134802957-1745226333739-replicate-prediction-1d0d93c9f9rm80cpawbst5q7qm_compressed.mp4"
          type="video/mp4"
        />
      </Head>
      <Box className="min-h-screen text-black bg-[#FFF]">
        <Banner />
        <Box className="mt-6">
          <Box className="flex justify-between items-center mb-4">
            <Box>
              <Typography variant="h5" className="font-semibold text-2xl text-[#1E1E1E]">
                {homeFeedData?.section1?.title}
              </Typography>
              <Typography variant="body2" className="text-normal pt-1 text-[#1E1E1EB2] text-base">
                {homeFeedData?.section1?.subtitle}
              </Typography>
            </Box>
          </Box>
          {isLoading ? (
            <ShimmerCategories />
          ) : (
            <Box className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {homeFeedData?.section1?.data?.slice(0, 4).map((card) => (
                <CardComponent
                  key={card?._id}
                  data={card}
                  redirect={`/category/${card?.slug}`}
                  handleLogin={() => setIsPopupVisible({ login: true })}
                />
              ))}
            </Box>
          )}

          <Box className="flex justify-center mt-6">
            <CLink href="/video-studio">
              {" "}
              <button
                variant="outlined"
                style={{ border: "1px solid #404040" }}
                className="rounded-xl normal-case bg-[#FFFFFF1A] text-black px-3 py-2 text-base"
              >
                Show all
              </button>
            </CLink>
          </Box>
          <Box className="flex justify-between items-center mb-4">
            <Box>
              <Typography variant="h5" className="font-semibold text-2xl text-[#1E1E1E]">
                {homeFeedData?.section2?.title}
              </Typography>
              <Typography variant="body2" className="text-normal pt-1 text-[#1E1E1EB2] text-base">
                {homeFeedData?.section2?.subtitle}
              </Typography>
            </Box>
          </Box>

          <Box className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {homeFeedData?.section2?.data?.slice(0, 4).map((card) => (
              <CardComponent
                key={card?._id}
                data={card}
                redirect={`/${card?.slug}`}
                handleLogin={() => setIsPopupVisible({ login: true })}
              />
            ))}
          </Box>

          <Box className="flex justify-center mt-6">
            <CLink href="/image-studio">
              {" "}
              <button
                variant="outlined"
                style={{ border: "1px solid #404040" }}
                className="rounded-xl normal-case bg-[#FFFFFF1A] text-black px-3 py-2 text-base"
              >
                Show all
              </button>
            </CLink>
          </Box>
          <div className="mt-12">
            <div className="w-full">
              <CommunityCreatedContent
                title={homeFeedData?.section3?.title}
                subTitle={homeFeedData?.section3?.subtitle}
                isTabEnabled
                isMobile={isMobile}
              />
            </div>
          </div>
        </Box>
        {isPopupVisible.login && (
          <LoginAndSignup
            callBackName={"uniqueCommunity"}
            open={isPopupVisible.login}
            handleModalClose={handleLoginPopupClose}
          />
        )}
      </Box>

      <SweetAlert2
        {...swalProps}
        onConfirm={handleConfirm}
        didClose={() => {
          sendEvent({
            event: "button_clicked",
            button_text: "Cancel",
            page_name: "Home Page",
            interaction_type: "Standard button",
            button_id: "popup_signup_canel_btn",
            section_name: "Popup",
          });
        }}
      />
    </div>
  );
};

export default Index;

export async function getServerSideProps(ctx) {
  const userAgent = ctx.req.headers["user-agent"] || "";
  const isMobile = /mobile|android|touch|webos|iphone|ipad|phone/i.test(userAgent);

  return {
    props: {
      isMobile,
    },
  };
}
