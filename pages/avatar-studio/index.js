import { Button } from "@mui/material";
import React, { useState } from "react";
import SectionCards from "../../src/component/SectionCards";
import Link from "next/link";
import fetcher from "../../src/dataProvider";
import { FANTV_API_URL } from "../../src/constant/constants";
import { useQuery } from "react-query";
import CardComponent from "../../src/component/CardComponent";
import CommunityCreatedContent from "../../src/component/CommunityCreatedContent";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/router";


const index = () => {
  const [avatarData, setAvatarData] = useState([]);
  const router = useRouter();

  useQuery(
    `${FANTV_API_URL}/api/v1/ai-avatar`,
    () => fetcher.get(`${FANTV_API_URL}/api/v1/ai-avatar?limit=50`),
    {
      refetchOnMount: "always",
      onSuccess: ({ data }) => {
        setAvatarData(data);
      },
    }
  );

  const [templates, setTemplates] = useState([]);

  const avatars = [
    {
      id: 1,
      title: "Fashion Influencer",
      image:
        "https://dynamic.heygen.ai/tr:h-720,c-at_max/image/b49d593feca543d68bc7074ee2c75bee/original",
      looks: "1 look"
    },
    // Add more avatars here
  ];

  useQuery(
    `${FANTV_API_URL}/api/v1/avatar_templates?limit=50`,
    () => fetcher.get(`${FANTV_API_URL}/api/v1/avatar_templates?limit=50`),
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
        <h1 className="text-black text-[32px] font-semibold text-center leading-[38px]">
          Avatar Studio
        </h1>
        {/* <p className="text-gray-700 pt-2 text-base font-normal text-center">
          VideoNation Creator Studio
        </p> */}
        <Link
          href={"/generate-avatar"}
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
              placeholder="Enter your prompt to create a AI avatar"
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
            <p variant="h5" className="font-semibold text-2xl text-[#1E1E1E]">
              What do you want to build
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
      {/* Create New Avatar Card */}
      <div
        className="min-h-[150px] border-2 border-dashed border-gray-400 flex flex-col items-center justify-center rounded-xl cursor-pointer hover:bg-gray-100 transition"
        style={{
            backgroundImage: "url('/images/photo-avatar-bg.jpg')", // 📷 background
              backgroundColor: "#FDE68A", // light gray-blue as fallback
          }}
          onClick={() => router.push("/generate-photo-avatar")}
      >
        <PlusCircle className="text-gray-500 w-8 h-8 mb-2" />
        <div className="text-gray-700 font-medium">Create Photo Avatar</div>
      </div>
        {/* Create New Avatar Card */}
        <div
        className="min-h-[150px] border-2 border-dashed border-gray-400 flex flex-col items-center justify-center rounded-xl cursor-pointer hover:bg-gray-100 transition"
        style={{
            backgroundImage: "url('/images/ai-avatar-bg.jpg')", // 🤖 background
            backgroundColor: "EDF2F7", // soft yellow as fallback
          }}
          onClick={() => router.push("/generate-avatar")}
      >
        <PlusCircle className="text-gray-500 w-8 h-8 mb-2" />
        <div className="text-gray-700 font-medium">Create AI Avatar</div>
      </div>

      {/* Avatar Cards */}
      {avatars.map((avatar) => (
        <div
          key={avatar.id}
          className="rounded-xl overflow-hidden shadow hover:shadow-md transition cursor-pointer"
        >
          <img
            src={avatar.image}
            alt={avatar.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-3 space-y-1">
            <div className="text-base font-semibold text-gray-800">{avatar.title}</div>
            <div className="text-sm text-gray-500">{avatar.looks}</div>

          </div>
        </div>
      ))}
    </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {avatarData?.results?.map((card) => (
            <CardComponent key={card.id} data={card} redirect={`/category/${card?.slug}`} />
          ))}
        </div>
      </div>
      <div className="mt-12">
        <div className="w-full">
          <CommunityCreatedContent
            title="Use Public Avatars"
            subTitle="Use avatars generated by our content and personlize them"
            data={templates}
            isTabEnabled
          />
        </div>
      </div>
    </div>
  );
};

export default index;
