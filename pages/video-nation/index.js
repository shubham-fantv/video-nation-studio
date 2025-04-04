import { Button } from "@mui/material";
import React, { useState } from "react";
import SectionCards from "../../src/component/SectionCards";
import Link from "next/link";
import fetcher from "../../src/dataProvider";
import { FANTV_API_URL } from "../../src/constant/constants";
import { useQuery } from "react-query";
import CardComponent from "../../src/component/CardComponent";
import CommunityCreatedContent from "../../src/component/CommunityCreatedContent";

const index = () => {
  const [homeFeedData, setHomeFeedData] = useState([]);

  useQuery(
    `${FANTV_API_URL}/api/v1/categories`,
    () => fetcher.get(`${FANTV_API_URL}/api/v1/categories`),
    {
      refetchOnMount: "always",
      onSuccess: ({ data }) => {
        setHomeFeedData(data);
      },
    }
  );

  const [templates, setTemplates] = useState([]);

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
        {/* <SectionCards data={homeFeedData?.section1} /> */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p variant="h5" className="font-semibold text-2xl text-white">
              {homeFeedData?.title}
            </p>
            <p variant="body2" className="text-normal pt-2 text-[#D2D2D2] text-base">
              {homeFeedData?.subtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {homeFeedData?.results?.map((card) => (
            <CardComponent key={card.id} data={card} redirect={`/category/${card.name}`} />
          ))}
        </div>
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
