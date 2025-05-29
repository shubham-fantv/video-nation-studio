import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { FANTV_API_URL } from "../constant/constants";
import fetcher from "../dataProvider";
import useIsMobile from "../hooks/useIsMobile";
import { useSelector } from "react-redux";
import useGTM from "../hooks/useGTM";
import LoginAndSignup from "./feature/Login";

const CommunityCreatedContent = ({
  title = "Community Created Content",
  subTitle = "Use the content created by our community as a template and add your taste",
  isTabEnabled = false,
  data,
  activeSlug = "all",
  page = "",
}) => {
  const [activeTab, setActiveTab] = useState(activeSlug);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [templateData, setTemplateData] = useState(data);

  const { isLoggedIn, userData } = useSelector((state) => state.user);
  const { sendEvent } = useGTM();

  const router = useRouter();
  const [allTabs, setAllTabs] = useState([]);

  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    setActiveTab(activeSlug);
  }, [activeSlug]);

  useEffect(() => {
    setActiveTab(activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab) {
      setTimeout(() => {
        refetch();
      }, 0);
    }
  }, [activeTab]);

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

  const { refetch } = useQuery(
    `${FANTV_API_URL}/api/v1/templates/category/${activeTab}?limit=50`,
    () => fetcher.get(`${FANTV_API_URL}/api/v1/templates/category/${activeTab}?limit=50`),
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
  const tabRefs = useRef({});

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

  const scrollToEnd = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollTabIntoView = (key) => {
    const tabEl = tabRefs.current[key];
    const container = scrollContainerRef.current;

    if (tabEl && container) {
      const tabRect = tabEl.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      if (tabRect.left < containerRect.left) {
        container.scrollBy({
          left: tabRect.left - containerRect.left - 16,
          behavior: "smooth",
        });
      } else if (tabRect.right > containerRect.right) {
        container.scrollBy({
          left: tabRect.right - containerRect.right + 16,
          behavior: "smooth",
        });
      }
    }
  };
  const isMobile = useIsMobile();

  const handleNavigate = (video) => {
    if (!isLoggedIn) {
      setIsPopupVisible(true);
    } else {
      sendEvent({
        event: page == "Category?" ? "Home --> Explore --> Recreate" : "Home --> Recreate",
        email: userData?.email,
        name: userData?.name,
        video: video?._id,
        category: activeSlug,
      });
      router.push(`/generate-video/${video?._id}`);
    }
  };

  return (
    <div className="text-black">
      <div>
        <h1 className="text-2xl font-bold mb-2 text-[#1E1E1E]">{title}</h1>
        <p className="text-base text-[#1E1E1EB2]">{subTitle}</p>
        <div className="w-full hidden md:flex" style={{ maxWidth: "1120px" }}>
          <div
            ref={scrollContainerRef}
            className="flex gap-2 mt-5 overflow-x-auto pb-1 md:pb-0 "
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <button
              key="all"
              className="px-4 py-1 rounded-full shrink-0"
              onClick={() => {
                setActiveTab("all");
                sendEvent({
                  event: "button_clicked",
                  button_text: "all",
                  interaction_type: "Filter Button",
                  section_name: "Template",
                  category_name: "all",
                  button_id: "vs_template_cat_filter_btn",
                });
              }}
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
                className="px-4 py-1 rounded-full shrink-0"
                ref={(el) => (tabRefs.current[tab.slug] = el)}
                onClick={() => {
                  setActiveTab(tab.slug);
                  scrollTabIntoView(tab.slug);
                  sendEvent({
                    event: "button_clicked",
                    button_text: tab?.slug,
                    interaction_type: "Filter Button",
                    section_name: "Template",
                    category_name: tab?.slug,
                    button_id: "vs_template_cat_filter_btn",
                  });
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

      <div className="mt-4 min-h-[50vh]">
        <div>
          <div className="columns-1 sm:columns-2 lg:columns-4 gap-4">
            {templateData &&
              templateData?.map((video, index) => (
                <div
                  key={index}
                  onClick={() => handleNavigate(video)}
                  className="mb-6 break-inside-avoid rounded-xl transition-transform relative"
                  onMouseEnter={() => handleMouseEnter(video._id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="relative">
                    <video
                      src={video?.videoUrl}
                      muted
                      loop
                      poster={video?.imageUrl}
                      playsInline
                      onMouseEnter={(e) => e.target.play()}
                      onMouseLeave={(e) => e.target.pause()}
                      onEnded={(e) => e.target.play()}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    {/* <video
                      src={video?.videoUrl}
                      muted
                      playsInline
                      poster={video?.imageUrl}
                      preload="metadata"
                      loop
                      className="w-full h-full object-cover rounded-xl"
                      onClick={(e) => {
                        if (isMobile) {
                          if (e.target.paused) {
                            e.target.play().catch((err) => console.log("Playback failed:", err));
                          } else {
                            e.target.pause();
                          }
                        }
                      }}
                      onMouseEnter={(e) => !isMobile && e.target.play()}
                      onMouseLeave={(e) => !isMobile && e.target.pause()}
                      onEnded={(e) => e.target.play()}
                    /> */}
                    {hoveredIndex === video._id && (
                      <div
                        className="absolute bottom-2 left-0 right-0 z-10 p-2 text-white bg-[#292929] rounded-b-xl"
                        style={{ transform: "translateY(100%)" }}
                      >
                        <div className="flex">
                          <div>
                            <h3 className="text-sm pb-1 font-medium line-clamp-1 text-amber-400">
                              {video?.title}
                            </h3>
                            <h3 className="text-xs font-normal line-clamp-2 pr-1">
                              {video?.prompt ||
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
                              onClick={() =>
                                sendEvent({
                                  event: "button_clicked",
                                  button_text: "Select",
                                  page_name: "Video Studio",
                                  interaction_type: "Standard Button",
                                  button_id: "vs_template_select_btn",
                                })
                              }
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
      {isPopupVisible && (
        <LoginAndSignup
          callBackName={"uniqueCommunity"}
          open={isPopupVisible}
          handleModalClose={() => setIsPopupVisible(false)}
        />
      )}
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
