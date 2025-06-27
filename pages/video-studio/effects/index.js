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
    // existing cards...
    {
      _id: "1",
      name: "Let's YMCA!",
      title: "Let's YMCA!",
      description: "Dance to the YMCA rhythm with AI animation.",
      imageUrl: "https://assets.artistfirst.in/uploads/ymca.jpg",
      videoUrl: "https://assets.artistfirst.in/uploads/ymca.mp4",
      isActive: true,
      slug: "lets-ymca",
      order: 5,
      categoryType: "video",
    },
    {
      _id: "2",
      name: "Subject 3 Fever",
      title: "Subject 3 Fever",
      description: "Feel the fever with Subject 3 visual style.",
      imageUrl: "https://assets.artistfirst.in/uploads/subject3.jpg",
      videoUrl: "https://assets.artistfirst.in/uploads/subject3.mp4",
      isActive: true,
      slug: "subject-3-fever",
      order: 6,
      categoryType: "video",
    },
    {
      _id: "3",
      name: "Ghibli Live!",
      title: "Ghibli Live!",
      description: "Transform your video into a live Ghibli scene.",
      imageUrl: "https://assets.artistfirst.in/uploads/ghibli.jpg",
      videoUrl: "https://assets.artistfirst.in/uploads/ghibli.mp4",
      isActive: true,
      slug: "ghibli-live",
      order: 7,
      categoryType: "video",
    },
    {
      _id: "4",
      name: "Suit Swagger",
      title: "Suit Swagger",
      description: "Put on a suit and strut with swagger.",
      imageUrl: "https://assets.artistfirst.in/uploads/suit.jpg",
      videoUrl: "https://assets.artistfirst.in/uploads/suit.mp4",
      isActive: true,
      slug: "suit-swagger",
      order: 8,
      categoryType: "video",
    },
    {
      _id: "5",
      name: "Muscle Surge",
      title: "Muscle Surge",
      description: "Bulk up instantly with AI-generated muscles.",
      imageUrl: "https://assets.artistfirst.in/uploads/muscle.jpg",
      videoUrl: "https://assets.artistfirst.in/uploads/muscle.mp4",
      isActive: true,
      slug: "muscle-surge",
      order: 9,
      categoryType: "video",
    },
    {
      _id: "6",
      name: "Emergency Beat",
      title: "Emergency Beat",
      description: "Dance like it’s an emergency drill!",
      imageUrl: "https://assets.artistfirst.in/uploads/emergency.jpg",
      videoUrl: "https://assets.artistfirst.in/uploads/emergency.mp4",
      isActive: true,
      slug: "emergency-beat",
      order: 10,
      categoryType: "video",
    },
    {
      _id: "7",
      name: "Kungfu Club",
      title: "Kungfu Club",
      description: "Enter the dojo with kungfu movie effects.",
      imageUrl: "https://assets.artistfirst.in/uploads/kungfu.jpg",
      videoUrl: "https://assets.artistfirst.in/uploads/kungfu.mp4",
      isActive: true,
      slug: "kungfu-club",
      order: 11,
      categoryType: "video",
    },
    {
      _id: "8",
      name: "Retro Anime Pop",
      title: "Retro Anime Pop",
      description: "Animate yourself in retro anime style.",
      imageUrl: "https://assets.artistfirst.in/uploads/retro.jpg",
      videoUrl: "https://assets.artistfirst.in/uploads/retro.mp4",
      isActive: true,
      slug: "retro-anime-pop",
      order: 12,
      categoryType: "video",
    },
    {
      _id: "9",
      name: "Vogue Walk",
      title: "Vogue Walk",
      description: "Strike a pose and walk the runway with AI flair.",
      imageUrl: "https://assets.artistfirst.in/uploads/vogue.jpg",
      videoUrl: "https://assets.artistfirst.in/uploads/vogue.mp4",
      isActive: true,
      slug: "vogue-walk",
      order: 13,
      categoryType: "video",
    },
    {
      _id: "10",
      name: "Mega Dive",
      title: "Mega Dive",
      description: "Jump into hyper-stylized cinematic action.",
      imageUrl: "https://assets.artistfirst.in/uploads/mega.jpg",
      videoUrl: "https://assets.artistfirst.in/uploads/mega.mp4",
      isActive: true,
      slug: "mega-dive",
      order: 14,
      categoryType: "video",
    },
    {
      _id: "11",
      name: "Evil Trigger",
      title: "Evil Trigger",
      description: "Unleash your dark side with Evil Trigger mode.",
      imageUrl: "https://assets.artistfirst.in/uploads/evil.jpg",
      videoUrl: "https://assets.artistfirst.in/uploads/evil.mp4",
      isActive: true,
      slug: "evil-trigger",
      order: 15,
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
            <Link href={`/video-studio/effects/${card.slug}`} passHref>
              <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden bg-white hover:shadow-lg transition">
                <video
                  src="/video.mp4"
                  className="w-full h-[200px] object-cover"
                  muted
                  loop
                  preload="metadata"
                  onMouseEnter={(e) => e.target.play()}
                  onMouseLeave={(e) => e.target.pause()}
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {card.description}
                  </p>

                  <button className="mt-4 bg-[#EAE7F4] text-black text-sm font-medium px-4 py-2 rounded-md flex items-center gap-2">
                    Explore Now
                    <span className="ml-1">→</span>
                  </button>
                </div>
              </div>
            </Link>
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
