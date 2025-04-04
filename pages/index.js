import { Box, Typography } from "@mui/material";
import { useMediaQuery } from "@mui/system";
import { default as React, useState } from "react";
import { useQuery } from "react-query";
import SectionCards from "../src/component/SectionCards";
import Banner from "../src/component/banner";
import fetcher from "../src/dataProvider";
import { FANTV_API_URL } from "../src/constant/constants";
import CLink from "../src/component/CLink";
import CardComponent from "../src/component/CardComponent";
import CommunityCreatedContent from "../src/component/CommunityCreatedContent";

const Index = () => {
  const [homeFeedData, setHomeFeedData] = useState([]);

  useQuery(
    `${FANTV_API_URL}/api/v1/homefeed`,
    () => fetcher.get(`${FANTV_API_URL}/api/v1/homefeed`),
    {
      refetchOnMount: "always",
      onSuccess: ({ data }) => {
        setHomeFeedData(data);
      },
    }
  );

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
            <CLink href="/video-studio">
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
          <div className="mt-12">
            <div className="w-full">
              <CommunityCreatedContent
                title={homeFeedData?.section2?.title}
                subTitle={homeFeedData?.section2?.subtitle}
                data={homeFeedData?.section2?.data}
              />
            </div>
          </div>
        </Box>
      </Box>
    </div>
  );
};

export default Index;
