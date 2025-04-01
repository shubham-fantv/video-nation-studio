import { Box, Typography } from "@mui/material";
import { useMediaQuery } from "@mui/system";
import { default as React, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SectionCards from "../src/component/SectionCards";
import Banner from "../src/component/banner";
import fetcher from "../src/dataProvider";
import { FANTV_API_URL } from "../src/constant/constants";
import CLink from "../src/component/CLink";
import CardComponent from "../src/component/CardComponent";

const Index = () => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [homeFeedData, setHomeFeedData] = useState([]);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["seasonTask"],
    queryFn: async () => {
      const response = await fetcher.get(`${FANTV_API_URL}/homefeed`);
      setHomeFeedData(response.data);
      return response?.data;
    },
    refetchOnMount: "always",
    onSuccess: (data) => {
      console.log("🚀 ~ Index ~ data:", data);

      setHomeFeedData(data);
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
          <Box className="flex justify-between items-center mb-4">
            <Box>
              <Typography variant="h5" className="font-semibold text-2xl text-white">
                {homeFeedData?.section1?.title}
              </Typography>
              <Typography variant="body2" className="text-normal pt-2 text-[#D2D2D2] text-base">
                {homeFeedData?.section1?.subtitle}
              </Typography>
            </Box>
          </Box>

          <Box className="grid grid-cols-4 gap-4">
            {homeFeedData?.section1?.data?.splice(0, 4)?.map((card) => (
              <CardComponent key={card.id} data={card} redirect={`/category/${card.name}`} />
            ))}
          </Box>

          <Box className="flex justify-center mt-6">
            <CLink href="/all-categories">
              {" "}
              <button
                variant="outlined"
                style={{ border: "1px solid #404040" }}
                className="rounded-xl normal-case text-white px-3 py-2 text-base"
              >
                Show all
              </button>
            </CLink>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Index;
