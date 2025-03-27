import { Button } from "@mui/material";
import React, { useState } from "react";
import SectionCards from "../../src/component/SectionCards";
import CommunityCreatedContent from "../../src/component/CommunityCreatedContent";

const index = () => {
  const [captionEnabled, setCaptionEnabled] = useState(false);

  return (
    <div>
      <div className="justify-center m-auto">
        <h1 className="text-white text-[32px] font-semibold text-center leading-[38px]">
          AI-Powered Video Creation. Just Type & Generate
        </h1>
        <p className="text-[#D2D2D2] pt-2 text-base font-normal text-center">
          Transform words into cinematic visuals—effortless, fast, and stunning.
        </p>
      </div>
      <div className="flex mt-8 w-full  flex-col gap-4 rounded-lg bg-[#292929] p-4 shadow-md">
        {/* Text Area */}
        <textarea
          className="w-full rounded-md bg-transparent p-3  text-sm text-[#D2D2D2] text-normal placeholder-gray-500 focus:outline-none"
          placeholder="Enter your prompt..."
          rows={6}
        >
          A girl sipping coffee while travelling in the train
        </textarea>

        {/* Buttons & Toggle */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-md bg-[#1E1E1E] px-4 py-2 text-sm text-[#D2D2D2] shadow-md transition-all hover:bg-gray-800">
            + Add image
          </button>

          <button className="flex items-center gap-2 rounded-md bg-[#1E1E1E] px-4 py-2 text-sm text-[#D2D2D2] shadow-md transition-all hover:bg-gray-800">
            <span className="w-4 h-3 border border-white rounded-sm"></span> 16:9
          </button>

          {/* Caption Toggle */}
          <button
            // onClick={() => setCaptionEnabled(!captionEnabled)}
            className="flex items-center gap-2 rounded-md bg-[#1E1E1E] px-4 py-2 text-sm text-[#D2D2D2] shadow-md transition-all"
          >
            <div
              className={`w-6 h-4 flex items-center rounded-full bg-gray-700 p-1 transition-all ${
                captionEnabled ? "bg-green-500" : "bg-gray-500"
              }`}
            >
              <div
                className={`h-3 w-3 rounded-full bg-white transition-transform ${
                  captionEnabled ? "translate-x-2" : ""
                }`}
              ></div>
            </div>
            Caption
          </button>

          <div className="flex-1"></div>

          <button className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-2 text-white shadow-md transition-all hover:brightness-110">
            ✨ Generate
          </button>
        </div>
      </div>
      <div className="w-full">
        <CommunityCreatedContent />
      </div>
    </div>
  );
};

export default index;
