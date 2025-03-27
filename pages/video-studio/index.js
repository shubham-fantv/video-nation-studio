import { Button } from "@mui/material";
import React from "react";
import SectionCards from "../../src/component/SectionCards";
import Link from "next/link";

const index = () => {
  return (
    <div>
      <div className="justify-center m-auto">
        <h1 className="text-white text-[32px] font-semibold text-center leading-[38px]">
          Video Studio
        </h1>
        <p className="text-[#D2D2D2] pt-2 text-base font-normal text-center">
          VideoNation Creator Studio
        </p>
        <Link href={"/generate"} passHref className="flex items-center justify-center w-full mt-4">
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
              <Button
                sx={{
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
                }}
              >
                <img src="/images/video-ai/star.png" style={{ height: "28px", width: "28px" }} />
                Generate
              </Button>
            </div>
          </div>
        </Link>
      </div>
      <div className="mt-12">
        <SectionCards />
      </div>
    </div>
  );
};

export default index;
