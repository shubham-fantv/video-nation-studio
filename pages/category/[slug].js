import { Button } from "@mui/material";
import React, { useState } from "react";
import SectionCards from "../../src/component/SectionCards";
import Link from "next/link";
import CommunityCreatedContent from "../../src/component/CommunityCreatedContent";
import { useQuery } from "react-query";
import fetcher from "../../src/dataProvider";
import { FANTV_API_URL } from "../../src/constant/constants";

const index = () => {
  const [templates, setTemplates] = useState([]);
  console.log("🚀 ~ index ~ templates:", templates);

  useQuery(
    `${FANTV_API_URL}/api/v1/templates?limit=30`,
    () => fetcher.get(`${FANTV_API_URL}/api/v1/templates?limit=30`),
    {
      refetchOnMount: "always",
      onSuccess: ({ data }) => {
        setTemplates(data.results);
      },
    }
  );

  return (
    <div>
      <div className="justify-center m-auto">
        <h1 className="text-white text-[32px] font-semibold text-center leading-[38px]">
          Video Studio
        </h1>
        <p className="text-[#D2D2D2] pt-2 text-base font-normal text-center">
          VideoNation Creator Studio
        </p>
        <Link
          href={"/generate-video"}
          passHref
          className="flex items-center justify-center w-full mt-4"
        >
          <div
            className="flex w-full items-center rounded-full border-2 border-gray-500 bg-white "
            style={{
              boxShadow: "0px 0px 14px 0px #00000040",
              backdropFilter: "blur(114px)",
            }}
          >
            <input
              type="text"
              placeholder="Enter Your Prompt"
              className="w-full rounded-full px-4 py-4 text-gray-700 placeholder-gray-400 focus:outline-none"
            />
            <div>
              <button
                style={{
                  background: "linear-gradient(180deg, #5A5A5A 0%, #1E1E1E 100%)",
                  border: "1px solid #FFFFFF",
                  borderRadius: "100px",
                  // width: "auto",
                  color: "#FFF",
                  fontSize: "16px",
                  textTransform: "capitalize",
                  width: "max-content",
                  paddingInline: "16px",
                  marginRight: "4px",
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 16px",
                }}
              >
                <img src="/images/video-ai/star.png" style={{ height: "28px", width: "28px" }} />
                Generate
              </button>
            </div>
          </div>
        </Link>
      </div>
      <div className="mt-12">
        <div className="w-full">
          <CommunityCreatedContent
            title="Use a Template"
            subTitle="Remix with our content created by our community"
            data={templates}
          />
        </div>
      </div>
    </div>
  );
};

export default index;
