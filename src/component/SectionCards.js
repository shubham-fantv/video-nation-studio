// components/SectionCards.js
import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CardComponent from "./CardComponent";
import { useQuery } from "@tanstack/react-query";
import { FANTV_API_URL } from "../constant/constants";
import fetcher from "../dataProvider";

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

function SectionCards() {
  const [homeFeedData, setHomeFeedData] = useState([]);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["seasonTask"],
    queryFn: async () => {
      const response = await fetcher.get(`${FANTV_API_URL}/v1/airdrop/season-task`);
      return response.data; // No need to manually update state here
    },
    refetchOnMount: "always",
    onSuccess: (data) => {
      setHomeFeedData(data); // Update state here if needed
    },
    onError: (error) => {
      console.error("🚀 ~ API Error:", error);
    },
  });

  return (
    <Box>
      <Box className="flex justify-between items-center mb-4">
        <Box>
          <Typography variant="h5" className="font-semibold text-2xl text-white">
            VideoNation Creator Studio
          </Typography>
          <Typography variant="body2" className="text-normal pt-2 text-[#D2D2D2] text-base">
            VideoNation Creator Studio
          </Typography>
        </Box>
      </Box>

      <Box className="grid grid-cols-4 gap-4">
        {cardData.map((card) => (
          <CardComponent key={card.id} data={card} />
        ))}
      </Box>

      <Box className="flex justify-center mt-6">
        <button
          variant="outlined"
          style={{ border: "1px solid #404040" }}
          className="rounded-xl normal-case text-white px-3 py-2 text-base"
        >
          Show all
        </button>
      </Box>
    </Box>
  );
}

export default SectionCards;
