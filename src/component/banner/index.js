// components/Banner.js
import React, { useEffect, useRef } from "react";
import { Box, Typography, Card, CardMedia, Button } from "@mui/material";

// Sample video sources
const videoCards = [
  {
    id: 2,
    src: "/images/video-ai/video2.mp4",
    poster: "/images/workshop-poster.jpg",
    width: 128,
    height: 169,
    position: { left: "27%", bottom: "8%" },
    rotation: "rotate(-5.97deg)",
    zIndex: 1,
  },
  {
    id: 3,
    src: "/images/video-ai/video2.mp4",
    poster: "/images/gallery-poster.jpg",
    width: 136,
    height: 192,
    position: { left: "40%", bottom: "12%" },
    rotation: "rotate(-0.45deg)",
    zIndex: 3,
  },
  {
    id: 4,
    src: "/images/video-ai/video2.mp4",
    poster: "/images/vr-poster.jpg",
    width: 212,
    height: 224,
    position: { left: "54%", bottom: "10%" },
    rotation: "rotate(11.16deg)",
    zIndex: 4,
  },
];

function Banner() {
  const videoRefs = useRef([]);

  useEffect(() => {
    // Set up all videos to autoplay when loaded
    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = true;
        video.playsInline = true;
        video.loop = true;

        // Play videos when they're loaded
        const playPromise = video.play();

        // Handle play promise to avoid uncaught promise errors
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            // Auto-play was prevented
            console.log("Autoplay prevented:", error);
            // Add play button or other UI here if needed
          });
        }
      }
    });

    // Clean up videos when component unmounts
    return () => {
      videoRefs.current.forEach((video) => {
        if (video) {
          video.pause();
          video.src = "";
          video.load();
        }
      });
    };
  }, []);

  return (
    <Box
      className="w-full rounded-2xl overflow-hidden relative"
      sx={{
        backgroundImage: 'url("/images/video-ai/bannerBg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "300px",
        display: "flex",
        justifyContent: "space-between",
        display: "flex",
      }}
    >
      <Box className="relative px-8 flex flex-col justify-center gap-4">
        <Typography variant="h3" className="font-semibold text-[32px] text-white font-inter">
          Lorem ipsum dolor sit amet, <br /> consectetur
        </Typography>
        <Typography variant="body1">Lorem ipsum dolor sit amet, consectetur</Typography>

        <button
          style={{
            background: "linear-gradient(180deg, #5A5A5A 0%, #1E1E1E 100%)",
            border: "1px solid #FFFFFF",
            borderRadius: "100px",
            width: "auto",
            color: "#FFF",
            fontSize: "16px",
            textTransform: "capitalize",
            width: "max-content",
            paddingInline: "16px",
            display: "flex",
            alignItems: "center",
            padding: "8px 16px",
          }}
        >
          <img src="/images/video-ai/star.png" style={{ height: "28px", width: "28px" }} />
          Generate Video
        </button>
      </Box>

      <Box className="relative  flex  justify-end items-end pb-6 pr-6 gap-4">
        {videoCards.map((card, index) => (
          <Box
            key={card.id}
            sx={{
              width: card.width,
              height: card.height,
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0px 4px 10px 0px #00000073",
            }}
          >
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              width={card.width}
              height={card.height}
              muted
              playsInline
              loop
              poster={card.poster}
              style={{ objectFit: "contain" }}
            >
              <source src={card.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default Banner;
