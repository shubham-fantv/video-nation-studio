// import React, { useEffect, useRef } from "react";
// import { Box, Typography, Card, CardMedia, Button } from "@mui/material";
// import CLink from "../CLink";

// const videoCards = [
//   {
//     id: 2,
//     src: "/images/video-ai/video2.mp4",
//     poster: "/images/workshop-poster.jpg",
//     width: 128,
//     height: 169,
//     position: { left: "27%", bottom: "8%" },
//     rotation: "rotate(-5.97deg)",
//     zIndex: 1,
//   },
//   {
//     id: 3,
//     src: "/images/video-ai/video2.mp4",
//     poster: "/images/gallery-poster.jpg",
//     width: 136,
//     height: 192,
//     position: { left: "40%", bottom: "12%" },
//     rotation: "rotate(-0.45deg)",
//     zIndex: 3,
//   },
//   {
//     id: 4,
//     src: "/images/video-ai/video2.mp4",
//     poster: "/images/vr-poster.jpg",
//     width: 212,
//     height: 224,
//     position: { left: "54%", bottom: "10%" },
//     rotation: "rotate(11.16deg)",
//     zIndex: 4,
//   },
// ];

// function Banner() {
//   const videoRefs = useRef([]);

//   useEffect(() => {
//     videoRefs.current.forEach((video) => {
//       if (video) {
//         video.muted = true;
//         video.playsInline = true;
//         video.loop = true;
//         const playPromise = video.play();
//         if (playPromise !== undefined) {
//           playPromise.catch((error) => {
//             console.log("Autoplay prevented:", error);
//           });
//         }
//       }
//     });

//     return () => {
//       videoRefs.current.forEach((video) => {
//         if (video) {
//           video.pause();
//           video.src = "";
//           video.load();
//         }
//       });
//     };
//   }, []);

//   return (
//     <Box
//       className="w-full rounded-2xl overflow-hidden relative"
//       sx={{
//         backgroundImage: 'url("/images/video-ai/bannerBg.png")',
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         height: "300px",
//         display: "flex",
//         justifyContent: "space-between",
//         display: "flex",
//       }}
//     >
//       <Box className="relative px-8 flex flex-col justify-center gap-4">
//         <Typography variant="h3" className="font-semibold text-[32px] text-white font-inter">
//           Lorem ipsum dolor sit amet, <br /> consectetur
//         </Typography>
//         <Typography variant="body1">Lorem ipsum dolor sit amet, consectetur</Typography>

//         <CLink href={"/generate-video"}>
//           {" "}
//           <button
//             style={{
//               background: "linear-gradient(180deg, #5A5A5A 0%, #1E1E1E 100%)",
//               border: "1px solid #FFFFFF",
//               borderRadius: "100px",
//               width: "auto",
//               color: "#FFF",
//               fontSize: "16px",
//               textTransform: "capitalize",
//               width: "max-content",
//               paddingInline: "16px",
//               display: "flex",
//               alignItems: "center",
//               padding: "8px 16px",
//             }}
//           >
//             <img src="/images/video-ai/star.png" style={{ height: "28px", width: "28px" }} />
//             Generate Video
//           </button>
//         </CLink>
//       </Box>

//       <Box className="relative  flex  justify-end items-end pb-6 pr-6 gap-4">
//         {videoCards.map((card, index) => (
//           <Box
//             key={card.id}
//             sx={{
//               width: card.width,
//               height: card.height,
//               borderRadius: "16px",
//               overflow: "hidden",
//               boxShadow: "0px 4px 10px 0px #00000073",
//             }}
//           >
//             <video
//               ref={(el) => (videoRefs.current[index] = el)}
//               width={card.width}
//               height={card.height}
//               muted
//               playsInline
//               loop
//               poster={card.poster}
//               style={{ objectFit: "contain" }}
//             >
//               <source src={card.src} type="video/mp4" />
//               Your browser does not support the video tag.
//             </video>
//           </Box>
//         ))}
//       </Box>
//     </Box>
//   );
// }

// export default Banner;
import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import CLink from "../CLink";
import { useSelector } from "react-redux";
import useGTM from "../../hooks/useGTM";

const videoCards = [
  // {
  //   id: 2,
  //   // src: "/images/video-ai/video2.mp4",
  //   src: "https://assets.artistfirst.in/uploads/1744316625596-e080895d-e9d6-4163-a201-e647be77ed55.mp4",
  //   poster: "/images/workshop-poster.jpg",
  //   width: 128,
  //   height: 169,
  //   position: { left: "27%", bottom: "8%" },
  //   rotation: "rotate(-5.97deg)",
  //   zIndex: 1,
  // },
  // {
  //   id: 3,
  //   // src: "/images/video-ai/video2.mp4",
  //   src: "https://assets.artistfirst.in/uploads/1749135915997-1749135679036-video2_compressed.mp4",
  //   poster: "/images/gallery-poster.jpg",
  //   width: 136,
  //   height: 192,
  //   position: { left: "40%", bottom: "12%" },
  //   rotation: "rotate(-0.45deg)",
  //   zIndex: 3,
  // },
  {
    id: 4,
    // src: "/images/video-ai/video2.mp4",
    src: "https://assets.artistfirst.in/uploads/1749134802957-1745226333739-replicate-prediction-1d0d93c9f9rm80cpawbst5q7qm_compressed.mp4",
    // poster: "/images/vr-poster.jpg",
    width: 160,
    height: 224,
    position: { left: "54%", bottom: "10%" },
    rotation: "rotate(11.16deg)",
    zIndex: 4,
  },
];

function Banner() {
  const videoRefs = useRef([]);
  const isMobile = useMediaQuery("(max-width:768px)");
  const [videoScale, setVideoScale] = useState(1);

  const { userData } = useSelector((state) => state.user);
  const { sendEvent } = useGTM();

  useEffect(() => {
    // Set appropriate scale for videos on mobile
    if (isMobile) {
      setVideoScale(0.85);
    } else {
      setVideoScale(1);
    }

    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = true;
        video.playsInline = true;
        video.loop = true;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Autoplay prevented:", error);
          });
        }
      }
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) {
          video.pause();
          video.src = "";
          video.load();
        }
      });
    };
  }, [isMobile]);

  return (
    <Box
      className="w-full rounded-2xl overflow-hidden relative"
      sx={{
        backgroundImage: 'url("/images/video-ai/bannerBg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: { xs: "auto", md: "auto" },
        minHeight: { md: "270px" },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
      }}
    >
      <Box
        className="relative px-4 md:px-8 flex flex-col justify-center gap-4"
        sx={{
          paddingTop: { xs: "2rem", md: 0 },
          paddingBottom: { xs: "1rem", md: 0 },
          zIndex: 5,
        }}
      >
        <Typography
          variant="h3"
          className="font-semibold text-white font-inter  md:w-max"
          sx={{
            fontSize: { xs: "24px", md: "32px" },
            lineHeight: { xs: "1.3", md: "normal" },
          }}
        >
          {isMobile ? (
            <span>Transform your ideas into stunning images / videos in seconds.</span>
          ) : (
            <span>
              Transform your ideas into stunning
              <br /> images / videos in seconds
            </span>
          )}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: "14px", md: "16px" },
          }}
          className="text-white "
        >
          Create, Customize & Captivate
        </Typography>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <CLink href={"/generate-video"}>
            <button
              onClick={() =>
                sendEvent({
                  event: "button_clicked",
                  button_text: "Generate Video",
                  page_name: "Home Page",
                  interaction_type: "Standard Button",
                  section_name: "Hero Banner",
                  button_id: "hp_gen_vid_hero_btn",
                })
              }
              style={{
                background: "linear-gradient(180deg, #5A5A5A 0%, #1E1E1E 100%)",
                border: "1px solid #FFFFFF",
                borderRadius: "100px",
                color: "#FFF",
                fontSize: isMobile ? "14px" : "16px",
                textTransform: "capitalize",
                // width: "max-content",
                display: "flex",
                alignItems: "center",
                padding: isMobile ? "6px 14px" : "8px 16px",
              }}
            >
              <img
                src="/images/video-ai/star.png"
                style={{
                  height: isMobile ? "24px" : "28px",
                  width: isMobile ? "24px" : "28px",
                  marginRight: "6px",
                }}
                alt="star icon"
              />
              Generate Video
            </button>
          </CLink>

          <CLink href={"/generate-image"}>
            <button
              onClick={() =>
                sendEvent({
                  event: "button_clicked",
                  button_text: "Generate Image",
                  page_name: "Home Page",
                  interaction_type: "Standard Button",
                  section_name: "Hero Banner",
                  button_id: "hp_gen_img_hero_btn",
                })
              }
              style={{
                background: "linear-gradient(180deg, #A855F7 0%, #1E1E1E 100%)",
                border: "1px solid #FFFFFF",
                borderRadius: "100px",
                color: "#FFF",
                fontSize: isMobile ? "14px" : "16px",
                textTransform: "capitalize",
                width: "max-content",
                display: "flex",
                alignItems: "center",
                padding: isMobile ? "6px 14px" : "8px 16px",
              }}
            >
              <img
                src="/images/video-ai/star.png"
                style={{
                  height: isMobile ? "24px" : "28px",
                  width: isMobile ? "24px" : "28px",
                  marginRight: "6px",
                }}
                alt="star icon"
              />
              Generate Image
            </button>
          </CLink>
        </div>
      </Box>

      <Box
        className="relative flex justify-between md:justify-end items-end "
        sx={{
          paddingBottom: { xs: "2rem", md: "1.5rem" },
          paddingRight: { xs: "1rem", md: "1.5rem" },
          paddingLeft: { xs: "1rem", md: "1.5rem" },
          gap: { xs: "4px", md: "1rem" },
          width: "100%",
          position: { xs: "absolute", md: "relative" },
          bottom: { xs: 0, md: "auto" },
          right: { xs: 0, md: "auto" },
        }}
      >
        <Box
          sx={{
            width: 200 * videoScale,
            height: "auto",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0px 4px 10px 0px #00000073",
            transformOrigin: "bottom right",
          }}
        >
          <img
            src="https://assets.artistfirst.in/uploads/1749123653160-1747494182065-AI_Art_Style_Cartoon.png"
            alt="video1"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              objectFit: "cover",
            }}
          />
          <video
            ref={(el) => (videoRefs.current[0] = el)}
            muted
            playsInline
            loop
            poster="/images/workshop-poster.jpg"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              objectFit: "cover",
              marginTop: "1px",
            }}
          >
            <source
              src="https://assets.artistfirst.in/uploads/1749134836258-1745495375865-replicate-prediction-rp7g44c4hdrmc0cpcxqskk3v18_compressed.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </Box>

        {videoCards.map((card, index) => (
          <Box
            key={card.id}
            sx={{
              width: card.width * videoScale,
              height: card.height * videoScale,
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0px 4px 10px 0px #00000073",
              // transform: isMobile ? "scale(0.7)" : "none",
              transformOrigin: "bottom right",
              marginLeft: "5px",
            }}
          >
            <video
              ref={(el) => (videoRefs.current[index + 1] = el)}
              width={169}
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
