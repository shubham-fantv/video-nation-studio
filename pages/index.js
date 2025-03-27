import { Box } from "@mui/material";
import { useMediaQuery } from "@mui/system";
import { default as React, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SectionCards from "../src/component/SectionCards";
import Banner from "../src/component/banner";
import fetcher from "../src/dataProvider";
import { FANTV_API_URL } from "../src/constant/constants";

const Index = () => {
  const isMobile = useMediaQuery("(max-width:768px)");
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
    <div>
      <Box className="min-h-screen text-white">
        <Banner />
        <Box className="mt-8">
          <SectionCards data={homeFeedData} />
        </Box>
      </Box>
    </div>
  );
};

export default Index;
