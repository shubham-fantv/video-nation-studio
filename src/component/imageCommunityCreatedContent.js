import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { FANTV_API_URL } from "../constant/constants";
import fetcher from "../dataProvider";
import { useSelector } from "react-redux";
import useGTM from "../hooks/useGTM";
import useIsMobile from "../hooks/useIsMobile";

const CommunityCreatedContent = ({
  title = "Community Created Content",
  subTitle = "Use the content created by our community as a template and add your taste",
  isTabEnabled = false,
  data,
  activeSlug = "all",
  page = "",
}) => {
  const [activeTab, setActiveTab] = useState(activeSlug);
  const [templateData, setTemplateData] = useState(data);
  const [allTabs, setAllTabs] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const isMobile = useIsMobile();
  const router = useRouter();
  const { userData } = useSelector((state) => state.user);
  const { sendEvent } = useGTM();

  const scrollContainerRef = useRef(null);
  const tabRefs = useRef({});

  useEffect(() => {
    setActiveTab(activeSlug);
  }, [activeSlug]);

  useEffect(() => {
    setTemplateData(data);
  }, [data]);

  useQuery(
    `${FANTV_API_URL}/api/v1/image_categories/category-tabs`,
    () => fetcher.get(`${FANTV_API_URL}/api/v1/image_categories/category-tabs`),
    {
      refetchOnMount: "always",
      onSuccess: ({ data }) => setAllTabs(data),
    }
  );

  const { refetch } = useQuery(
    `${FANTV_API_URL}/api/v1/image_templates/category/${activeTab}?limit=50`,
    () => fetcher.get(`${FANTV_API_URL}/api/v1/image_templates/category/${activeTab}?limit=50`),
    {
      refetchOnMount: "always",
      enabled: isTabEnabled,
      onSuccess: ({ data }) => setTemplateData(data.results),
    }
  );

  const scrollTabIntoView = (key) => {
    const tabEl = tabRefs.current[key];
    const container = scrollContainerRef.current;
    if (tabEl && container) {
      const tabRect = tabEl.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      if (tabRect.left < containerRect.left) {
        container.scrollBy({ left: tabRect.left - containerRect.left - 16, behavior: "smooth" });
      } else if (tabRect.right > containerRect.right) {
        container.scrollBy({ left: tabRect.right - containerRect.right + 16, behavior: "smooth" });
      }
    }
  };

  const handleNavigate = (image) => {
    sendEvent({
      event: page === "Category?" ? "Home --> Explore --> Recreate" : "Home --> Recreate",
      email: userData?.email,
      name: userData?.name,
      image: image?._id,
      category: activeSlug,
    });
    router.push(`/generate-image/${image?._id}`);
  };

  return (
    <div className="text-black">
      <div>
        <h1 className="text-2xl font-bold mb-2 text-[#1E1E1E]">{title}</h1>
        <p className="text-base text-[#1E1E1EB2]">{subTitle}</p>

        {/* Tabs */}
        <div className="w-full" style={{ maxWidth: "1120px" }}>
          <div
            ref={scrollContainerRef}
            className="flex gap-2 mt-5 overflow-x-auto pb-1 md:pb-0"
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
                border: activeTab === "all" ? "1px solid #FFFFFF4D" : "none",
                color: activeTab === "all" ? "#FFF" : "#000",
              }}
            >
              All
            </button>

            {allTabs.map((tab) => (
              <button
                key={tab.slug}
                ref={(el) => (tabRefs.current[tab.slug] = el)}
                className="px-4 py-1 rounded-full shrink-0"
                onClick={() => {
                  setActiveTab(tab.slug);
                  scrollTabIntoView(tab.slug);
                }}
                style={{
                  background:
                    activeTab === tab.slug
                      ? "linear-gradient(180deg, #6C6C6C 0%, #4B4B4B 100%)"
                      : "transparent",
                  border: activeTab === tab.slug ? "1px solid #FFFFFF4D" : "none",
                  color: activeTab === tab.slug ? "#FFF" : "#000",
                }}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Image Grid */}
      <div className="mt-4 min-h-[50vh]">
        <div>
          <div className="columns-1 sm:columns-2 lg:columns-4 gap-4">
            {templateData?.map((image, index) => (
              <div
                key={index}
                onClick={() => handleNavigate(image)}
                className="mb-6 break-inside-avoid rounded-xl transition-transform relative cursor-pointer"
                onMouseEnter={() => setHoveredIndex(image._id)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="relative">
                  <img
                    src={image?.finalImageUrl}
                    alt={image?.prompt || "Generated Image"}
                    className="w-full h-full object-cover rounded-xl"
                  />

                  {hoveredIndex === image._id && (
                   <div
                   className="absolute bottom-2 left-0 right-0 z-10 p-2 text-white bg-[#292929] rounded-b-xl"
                   style={{ transform: "translateY(100%)" }}
                 >
                   <div className="flex">
                     <div>
                       <h3 className="text-sm pb-1 font-medium line-clamp-1 text-amber-400">
                         {image?.title}
                       </h3>
                       <h3 className="text-xs font-normal line-clamp-2 pr-1">
                         {image?.prompt ||
                           "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod"}
                       </h3>
                     </div>

                     <div className="flex justify-end">
                       <button
                         style={{
                           background: "linear-gradient(180deg, #5A5A5A 0%, #1E1E1E 100%)",
                           border: "1px solid #FFFFFF",
                           borderRadius: "100px",
                           color: "#FFF",
                           fontSize: "14px",
                           textTransform: "capitalize",
                           width: "max-content",
                           marginRight: "0px",
                           display: "flex",
                           alignItems: "center",
                           padding: "2px 8px",
                           alignSelf: "center",
                         }}
                       >
                         <img
                           src="/images/video-ai/star.png"
                           style={{ height: "20px", width: "20px" }}
                         />
                         Select
                       </button>
                     </div>
                   </div>
                 </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityCreatedContent;
