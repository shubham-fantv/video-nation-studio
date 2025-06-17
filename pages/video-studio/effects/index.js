import { Button } from "@mui/material";
import React, { useState } from "react";
import SectionCards from "../../../src/component/SectionCards";
import Link from "next/link";
import fetcher from "../../../src/dataProvider";
import { FANTV_API_URL } from "../../../src/constant/constants";
import { useQuery } from "react-query";
import CardComponent from "../../../src/component/CardComponent";
import CommunityCreatedContent from "../../../src/component/CommunityCreatedContent";

const index = () => {
  const cards = [
    {
      _id: "67eb8d667ee0c7027297d9cf",
      name: "Horse Ride",
      title: "Horse Ride",
      description: "Create cinematic video of person riding a horse.",
      imageUrl:
        "https://assets.artistfirst.in/uploads/1749124709716-1745493654384-ad.png",
      videoUrl:
        "https://assets.artistfirst.in/uploads/1745221496311-replicate-prediction-3qqs5az5nsrm80cpawrbr0qpwg.mp4",
      isActive: true,
      created_at: "2025-04-01T06:53:26.121Z",
      updated_at: "2025-04-01T06:53:26.121Z",
      __v: 0,
      slug: "horse-ride",
      order: 1,
      categoryType: "video",
    },
    {
      _id: "67f797587ee0c7027297db69",
      name: "Gender Swap",
      title: "Gender Swap",
      description: "Swap gender using AI transformation.",
      imageUrl:
        "https://assets.artistfirst.in/uploads/1749124672207-1745493748456-ciine.png",
      videoUrl:
        "https://assets.artistfirst.in/uploads/1744882660968-replicate-prediction-s357802zy1rma0cp8bmtbz391r.mp4",
      isActive: true,
      created_at: "2025-04-10T10:03:04.112Z",
      updated_at: "2025-04-10T10:03:04.112Z",
      __v: 0,
      slug: "gender-swap",
      order: 2,
      categoryType: "video",
    },
    {
      _id: "67eb9f7e7ee0c7027297d9e5",
      name: "Older to Younger",
      title: "Older Self to Younger Self",
      description: "Rejuvenate your older photo into youthful version.",
      imageUrl:
        "https://assets.artistfirst.in/uploads/1749124686420-1745493792249-insta.png",
      videoUrl:
        "https://assets.artistfirst.in/uploads/1744781901746-replicate-prediction-t3sc10t315rme0cp71pazajnv4.mp4",
      isActive: true,
      created_at: "2025-04-01T08:10:38.740Z",
      updated_at: "2025-04-01T08:10:38.740Z",
      __v: 0,
      slug: "older-to-younger",
      order: 3,
      categoryType: "video",
    },
    {
      _id: "67eb9f7e7ee0c7027297d9e6",
      name: "Baby Podcast",
      title: "Baby Podcast",
      description: "Make the person appear like a baby hosting a podcast.",
      imageUrl:
        "https://assets.artistfirst.in/uploads/1749124686420-1745493792249-insta.png",
      videoUrl:
        "https://assets.artistfirst.in/uploads/1744781901746-replicate-prediction-t3sc10t315rme0cp71pazajnv4.mp4",
      isActive: true,
      created_at: "2025-04-01T08:10:38.740Z",
      updated_at: "2025-04-01T08:10:38.740Z",
      __v: 0,
      slug: "baby-podcast",
      order: 4,
      categoryType: "video",
    },
  ];

  return (
    <div>
      <div className="justify-center m-auto">
        <h1 className="text-black text-[32px] font-semibold text-center leading-[38px]">
          Video Studio
        </h1>
        {/* <p className="text-gray-700 pt-2 text-base font-normal text-center">
          VideoNation Creator Studio
        </p> */}
        <Link
          href={"/generate-video"}
          passHref
          className="flex items-center justify-center w-full mt-6"
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
              readOnly
              placeholder="Enter your prompt to create a AI video"
              className="w-full rounded-full px-4 py-4 text-gray-700 placeholder-gray-400 focus:outline-none"
            />
            <div>
              <button
                style={{
                  background:
                    "linear-gradient(180deg, #5A5A5A 0%, #1E1E1E 100%)",
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
                <img
                  src="/images/video-ai/star.png"
                  style={{ height: "28px", width: "28px" }}
                />
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
            <p variant="h5" className="font-semibold text-2xl text-[#1E1E1E]">
              Categories
            </p>
            <p
              variant="body2"
              className="text-normal pt-2 text-[#1E1E1EB2] text-base"
            >
              Pick a category to discover purpose-built templates
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {cards?.map((card) => (
            // <CardComponent
            //   key={card.id}
            //   data={card}
            //   redirect={`/video-studio/effects/${card?.slug}`}
            // />
            <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden bg-white hover:shadow-lg transition">
              <img
                src={card.imageUrl}
                alt={card.title}
                className="w-full h-[200px] object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm mt-1">{card.description}</p>
                <Link href={`/video-studio/effects/${card.slug}`} passHref>
                  <button className="mt-4 bg-[#EAE7F4] text-black text-sm font-medium px-4 py-2 rounded-md flex items-center gap-2">
                    Use this Effect
                    <span className="ml-1">→</span>
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-12">
        <div className="w-full">
          {/* <CommunityCreatedContent
            title="Use a Template"
            subTitle="Remix with our content created by our community"
            data={templates}
            isTabEnabled
          /> */}
        </div>
      </div>
    </div>
  );
};

export default index;
