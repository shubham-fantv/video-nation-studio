// import React, { useState } from "react";

// const CommunityCreatedContent = () => {
//   const [activeTab, setActiveTab] = useState("All");

//   const tabs = ["All", "Product Videos", "Music Videos", "Marketing Reels", "Explainer Videos"];

//   const images = [
//     { src: "/images/video-ai/images/img1.png", height: 200 },
//     { src: "/images/video-ai/images/img2.png", height: 300 },
//     { src: "/images/video-ai/images/img3.png", height: 400 },
//     { src: "/images/video-ai/images/img2.png", height: 450 },
//     { src: "/images/video-ai/images/img1.png", height: 400 },
//     { src: "/images/video-ai/images/img3.png", height: 200 },
//     { src: "/images/video-ai/images/img1.png", height: 400 },
//     { src: "/images/video-ai/images/img1.png", height: 450 },
//     { src: "/images/video-ai/images/img1.png", height: 500 },
//     { src: "/images/video-ai/images/img3.png", height: 300 },
//     { src: "/images/video-ai/images/img2.png", height: 200 },
//     { src: "/images/video-ai/images/img2.png", height: 300 },
//     { src: "/images/video-ai/images/img3.png", height: 300 },
//     { src: "/images/video-ai/images/img1.png", height: 300 },
//     { src: "/images/video-ai/images/img1.png", height: 450 },
//     { src: "/images/video-ai/images/img1.png", height: 300 },
//   ];

//   return (
//     <div className="mt-8 text-white">
//       <div className="mb-6">
//         <h1 className="text-4xl font-bold mb-4">Community Created Content</h1>
//         <p className="text-lg text-gray-300 mb-6">
//           Remix with our content created by our community
//         </p>

//         {/* Tabs */}
//         <div className="flex space-x-4 border-b border-gray-800">
//           {tabs.map((tab) => (
//             <button
//               key={tab}
//               className={`pb-3 ${
//                 activeTab === tab
//                   ? "text-white border-b-2 border-white"
//                   : "text-gray-500 hover:text-gray-300"
//               }`}
//               onClick={() => setActiveTab(tab)}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Masonry-like Grid */}
//       <div className="grid grid-cols-3 gap-4 auto-rows-auto">
//         {images.map((image, index) => (
//           <div
//             key={index}
//             className={`
//               overflow-hidden rounded-xl
//             `}
//             style={{
//               gridRow: `span ${Math.ceil(image.height / 100)}`,
//             }}
//           >
//             <img
//               src={image.src}
//               alt={`Community content ${index + 1}`}
//               className="w-full h-full object-cover"
//               style={{
//                 height: `${image.height}px`,
//                 aspectRatio: "16/9",
//               }}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CommunityCreatedContent;

import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { FANTV_API_URL } from "../constant/constants";
import fetcher from "../dataProvider";

const CommunityCreatedContent = ({
  title = "Community Created Content",
  subTitle = "Remix with our content created by our community",
  isTabEnabled = false,
  data,
}) => {
  const [activeTab, setActiveTab] = useState("all");

  const [templateData, setTemplateData] = useState(data);

  const router = useRouter();
  const [allTabs, setAllTabs] = useState([]);

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  useEffect(() => {
    setTemplateData(data);
  }, [data]);

  useQuery(
    `${FANTV_API_URL}/api/v1/categories/category-tabs`,
    () => fetcher.get(`${FANTV_API_URL}/api/v1/categories/category-tabs`),
    {
      refetchOnMount: "always",
      onSuccess: ({ data }) => {
        setAllTabs(data);
      },
    }
  );

  useQuery(
    `${FANTV_API_URL}/api/v1/templates/category/${activeTab}`,
    () => fetcher.get(`${FANTV_API_URL}/api/v1/templates/category/${activeTab}`),
    {
      refetchOnMount: "always",
      enabled: isTabEnabled,
      onSuccess: ({ data }) => {
        setTemplateData(data.results);
      },
    }
  );

  const [isOverflowing, setIsOverflowing] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current;
        setIsOverflowing(scrollWidth > clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  return (
    <div className="text-white">
      <div>
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-base text-[#D2D2D2]">{subTitle}</p>

        {/* {isTabEnabled && (
          <div className="gap-4 mt-5">
            <button
              key={"all"}
              className={`px-4 py-1 rounded-t-lg`}
              onClick={() => setActiveTab("all")}
              style={{
                background:
                  activeTab === "all"
                    ? "linear-gradient(180deg, #6C6C6C 0%, #4B4B4B 100%)"
                    : "transparent",
                borderRadius: activeTab === "all" ? "100px" : "null",
                border: activeTab === "all" ? "1px solid #FFFFFF4D" : "1px solid #1e1e1e",
                color: activeTab === "all" ? "#FFF" : "#D2D2D2",
              }}
            >
              All
            </button>
            {allTabs?.map((tab) => (
              <button
                key={tab}
                className={`px-4 py-1 rounded-t-lg  m-1`}
                onClick={() => setActiveTab(tab?.slug)}
                style={{
                  background:
                    activeTab === tab?.slug
                      ? "linear-gradient(180deg, #6C6C6C 0%, #4B4B4B 100%)"
                      : "transparent",
                  borderRadius: activeTab === tab?.slug ? "100px" : "null",
                  border: activeTab === tab?.slug ? "1px solid #FFFFFF4D" : "1px solid #1e1e1e",
                  color: activeTab === tab?.slug ? "#FFF" : "#D2D2D2",
                }}
              >
                {tab?.name}
              </button>
            ))}
          </div>
        )} */}

        <div className="w-full">
          {/* Tab container with horizontal scroll on small screens */}
          <div
            ref={scrollContainerRef}
            className="flex gap-2 mt-5 overflow-x-auto pb-2 md:pb-0 md:flex-wrap"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <button
              key="all"
              className="px-4 py-1 rounded-full shrink-0"
              onClick={() => setActiveTab("all")}
              style={{
                background:
                  activeTab === "all"
                    ? "linear-gradient(180deg, #6C6C6C 0%, #4B4B4B 100%)"
                    : "transparent",
                border: activeTab === "all" ? "1px solid #FFFFFF4D" : "1px solid #1e1e1e",
                color: activeTab === "all" ? "#FFF" : "#D2D2D2",
              }}
            >
              All
            </button>

            {allTabs.map((tab) => (
              <button
                key={tab.slug}
                className="px-4 py-1 rounded-full shrink-0"
                onClick={() => setActiveTab(tab.slug)}
                style={{
                  background:
                    activeTab === tab.slug
                      ? "linear-gradient(180deg, #6C6C6C 0%, #4B4B4B 100%)"
                      : "transparent",
                  border: activeTab === tab.slug ? "1px solid #FFFFFF4D" : "1px solid #1e1e1e",
                  color: activeTab === tab.slug ? "#FFF" : "#D2D2D2",
                }}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {isOverflowing && (
            <div className="flex justify-end mt-1 md:hidden">
              <span className="text-xs text-gray-400">Scroll for more →</span>
            </div>
          )}
        </div>
      </div>

      <div className="min-h-[50vh] mt-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 ">
          {templateData &&
            templateData?.map((video, index) => (
              <div
                key={video?._id}
                onClick={() => router.push(`/generate-video/${video?._id}`)}
                className="rounded-xl  cursor-pointer relative"
                onMouseEnter={() => handleMouseEnter(video._id)}
                onMouseLeave={handleMouseLeave}
              >
                <video
                  src={video?.videoUrl}
                  muted
                  poster={video.imageUrl}
                  loop
                  playsInline
                  onMouseEnter={(e) => e.target.play()}
                  onMouseLeave={(e) => e.target.pause()}
                  onEnded={(e) => e.target.play()}
                  className="w-full  h-full object-cover rounded-xl"
                />
                {hoveredIndex == video._id && (
                  <div
                    className="absolute bottom-[-75%] left-0 rounded-b-xl right-0 z-1  p-3  text-white bg-[#653EFF]"
                    style={{ zIndex: "999999" }}
                  >
                    <h3 className="text-xl pb-2 font-medium truncate">{video?.title}</h3>
                    <h3 className="text-sm font-medium line-clamp-2">
                      {video?.prompt ||
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod"}
                    </h3>
                    <div className="flex justify-end">
                      <button
                        style={{
                          background: "linear-gradient(180deg, #5A5A5A 0%, #1E1E1E 100%)",
                          border: "1px solid #FFFFFF",
                          borderRadius: "100px",
                          color: "#FFF",
                          fontSize: "16px",
                          textTransform: "capitalize",
                          width: "max-content",
                          marginRight: "4px",
                          display: "flex",
                          alignItems: "center",
                          display: "flex",
                          padding: "8px 16px",
                          marginTop: "8px",
                        }}
                      >
                        <img
                          src="/images/video-ai/star.png"
                          style={{ height: "28px", width: "28px" }}
                        />
                        Recreate
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityCreatedContent;

{
  /* Masonry Grid - Simple CSS Solution */
}
{
  /* <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 ">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => router.push("/generate-video")}
            className="mb-4 break-inside-avoid overflow-hidden rounded-xl transition-transform hover:scale-[1.02]"
          >
            <img
              src={image.src}
              alt={`Community content ${index + 1}`}
              className="w-full h-auto object-cover rounded-xl"
              style={{ height: `${image.height}px` }}
            />
          </div>
        ))}
      </div> */
}
