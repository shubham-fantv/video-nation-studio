import { useRef, useEffect, useState } from "react";
import { isMobileDevice } from "../utils/isMobile";

export default function VideoCard({
  video,
  handleNavigate,
  handleMouseEnter,
  handleMouseLeave,
  hoveredIndex,
  sendEvent,
  useIntersectionVideo,
}) {
  const videoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // detect device once on mount
  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  const { observe, unobserve } = useIntersectionVideo((isVisible, element) => {
    if (isVisible) {
      element.play().catch(() => {});
    } else {
      element.pause();
    }
  }, 0.75);

  useEffect(() => {
    if (isMobile && videoRef.current) {
      observe(videoRef.current);
      return () => unobserve();
    }
  }, [isMobile, videoRef.current]);

  return (
    <div
      onClick={() => handleNavigate(video)}
      className="mb-6 break-inside-avoid rounded-xl transition-transform relative"
      onMouseEnter={!isMobile ? () => handleMouseEnter(video._id) : undefined}
      onMouseLeave={!isMobile ? handleMouseLeave : undefined}
    >
      <div
        className="w-full h-full object-cover rounded-xl relative"
        style={{
          backgroundImage: `url(${video?.imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "12px",
        }}
      >
        <video
          ref={videoRef}
          src={video?.videoUrl}
          muted
          loop
          playsInline
          webkit-playsinline="true"
          controlslist="nodownload"
          preload="none"
          poster={video?.imageUrl}
          className="w-full h-full object-cover rounded-xl"
          onMouseEnter={!isMobile ? (e) => e.target.play() : undefined}
          onMouseLeave={!isMobile ? (e) => e.target.pause() : undefined}
        />
        {hoveredIndex === video._id && !isMobile && (
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
                  {video?.prompt || "Lorem ipsum..."}
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
                  <img src="/images/video-ai/star.png" style={{ height: "20px", width: "20px" }} />
                  Select
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
