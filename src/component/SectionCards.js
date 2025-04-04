// components/SectionCards.js
import { Box, Typography } from "@mui/material";
import React from "react";
import CardComponent from "./CardComponent";

const cardData = [
  {
    id: 1,
    title: "Insta Marketing Reel",
    image: "/images/video-ai/img1.png",
    description: "All in one studio for image generation, AI editing and more",
  },
  {
    id: 2,
    title: "Product Marketing Reel",
    image: "/images/video-ai/img2.png",
    description: "All in one studio for image generation, AI editing and more",
  },
  {
    id: 3,
    title: "Create Music Video",
    image: "/images/video-ai/img3.png",
    description: "All in one studio for image generation, AI editing and more",
  },
  {
    id: 4,
    title: "Music Studio",
    image: "/images/video-ai/img4.png",
    description: "All in one studio for image generation, AI editing and more",
  },
];

function SectionCards({ data }) {
  return (
    <Box>
      <Box className="flex justify-between items-center mb-4">
        <Box>
          <Typography variant="h5" className="font-semibold text-2xl text-white">
            {data?.title}
          </Typography>
          <Typography variant="body2" className="text-normal pt-2 text-[#D2D2D2] text-base">
            {data?.subtitle}
          </Typography>
        </Box>
      </Box>

      <Box className="grid grid-cols-4 gap-4">
        {data?.data?.splice(0, 4)?.map((card) => (
          <CardComponent key={card.id} data={card} redirect={`/category/${card?.slug}`} />
        ))}
      </Box>
    </Box>
  );
}

export default SectionCards;
