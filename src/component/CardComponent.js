import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CLink from "./CLink";
import { getDriveImageUrl } from "../utils/common";

function CardComponent({ data, redirect }) {
  const imageUrl = getDriveImageUrl(data.imageUrl);
  return (
    <Box
      className="bg-[#FFFFFF0D] rounded-xl overflow-hidden"
      sx={{ boxShadow: "0px 4px 4px 0px #00000040" }}
    >
      <Box className="w-full overflow-hidden">
        <img
          src={data?.imageUrl}
          className="cover"
          class="h-full object-cover h-64"
          alt="description"
        />
      </Box>
      <Box className="pt-4 px-4">
        <Typography variant="h6" className="font-regular mb-2 text-white text-base wrap-1-line">
          {data?.title}
        </Typography>
        <Typography variant="body2" className=" font-regular text-[#D2D2D2] text-sm wrap-2-line">
          {data?.description}
        </Typography>
        <CLink route={redirect}>
          <button
            size="small"
            className="mt-6 py-2 px-4 rounded-xl text-sm font-regular normal-case flex  text-[#1E1E1E] bg-white"
          >
            Explore Now
            <img
              src="/images/video-ai/arrowRight.png"
              style={{ height: "16px", width: "16px", marginLeft: "8px" }}
            />
          </button>
        </CLink>
      </Box>
      <img src="/images/ellipse.png"></img>
    </Box>
  );
}

export default CardComponent;
