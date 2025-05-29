import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CLink from "./CLink";
import { getDriveImageUrl, getPageName } from "../utils/common";
import { useRouter } from "next/router";
import useGTM from "../hooks/useGTM";

function CardComponent({ data, redirect }) {
  const imageUrl = getDriveImageUrl(data.imageUrl);
  const router = useRouter();
  const { sendEvent } = useGTM();

  return (
    <CLink
      route={redirect}
      handleClick={() =>
        sendEvent({
          event: "card_clicked",
          card_title: data.title,
          page_name: getPageName(router?.pathname),
          card_id: data?.categoryType == "image" ? "image_use_case_card" : "video_category_card",
          section_name: data?.categoryType + " Category",
        })
      }
    >
      <Box
        className="bg-[#FFFFFF0D] rounded-xl overflow-hidden"
        sx={{ boxShadow: "0px 4px 4px 0px #00000040" }}
      >
        <Box className="w-full md:h-40  overflow-hidden">
          <img
            src={data?.imageUrl}
            className="cover"
            // class="object-cover md:h-full"
            alt="description"
          />
        </Box>
        <Box className="pt-4 px-4">
          <Typography
            variant="h6"
            className="font-regular mb-2 text-[#1E1E1E] text-base wrap-1-line"
          >
            {data?.title}
          </Typography>
          <Typography
            variant="body2"
            className=" font-regular text-[#1E1E1EB2] text-sm wrap-2-line"
          >
            {data?.description}
          </Typography>
          <button
            size="small"
            className="mt-6 py-2 px-4 rounded-xl text-sm font-regular normal-case flex bg-[#1E1E1E]  text-[#FFFFFF] "
            onClick={(e) => {
              e.stopPropagation();
              router.push(redirect);
              sendEvent({
                event: "button_clicked",
                button_text: "Explore Now",
                category_name: data.title,
                page_name: getPageName(router?.pathname),
                interaction_type: "Standard Button",
                section_name: data?.categoryType + " Category",
                button_id:
                  data?.categoryType == "image" ? "img_cat_explore_btn" : "vs_cat_explore_btn",
              });
            }}
          >
            Explore Now
            <img
              src="/images/video-ai/arrowRight.svg"
              style={{ height: "16px", width: "16px", marginLeft: "8px" }}
              className="text-white"
            />
          </button>
        </Box>
        <img src="/images/ellipse.png"></img>
      </Box>
    </CLink>
  );
}

export default CardComponent;
