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
import React, { useState } from "react";

const CommunityCreatedContent = ({
  title = "Community Created Content",
  subTitle = "Remix with our content created by our community",
  isTabEnabled = false,
  data,
}) => {
  console.log("🚀 ~ data:", data);
  const [activeTab, setActiveTab] = useState("All");

  const router = useRouter();
  const tabs = ["All", "Product Videos", "Music Videos", "Marketing Reels", "Explainer Videos"];

  const images = [
    { src: "/images/video-ai/images/img1.png", height: 200 },
    { src: "/images/video-ai/images/img2.png", height: 300 },
    { src: "/images/video-ai/images/img3.png", height: 400 },
    { src: "/images/video-ai/images/img2.png", height: 450 },
    { src: "/images/video-ai/images/img1.png", height: 400 },
    { src: "/images/video-ai/images/img3.png", height: 200 },
    { src: "/images/video-ai/images/img1.png", height: 400 },
    { src: "/images/video-ai/images/img1.png", height: 450 },
    { src: "/images/video-ai/images/img1.png", height: 500 },
    { src: "/images/video-ai/images/img3.png", height: 300 },
    { src: "/images/video-ai/images/img2.png", height: 200 },
    { src: "/images/video-ai/images/img2.png", height: 300 },
    { src: "/images/video-ai/images/img3.png", height: 300 },
    { src: "/images/video-ai/images/img1.png", height: 300 },
    { src: "/images/video-ai/images/img1.png", height: 450 },
    { src: "/images/video-ai/images/img1.png", height: 300 },
  ];

  const [hoveredIndex, setHoveredIndex] = useState(null);
  // Extract the videos data and parse aspect ratio
  const videos = data?.results?.map((item) => {
    // Parse aspect ratio (e.g., "16:9" to calculate padding percentage)
    const [width, height] = item.aspectRatio.split(":").map(Number);
    const paddingPercentage = (height / width) * 100;

    return {
      id: item._id,
      title: item.title,
      imageUrl: item.imageUrl,
      videoUrl: item.videoUrl,
      aspectRatio: item.aspectRatio,
      paddingPercentage,
    };
  });

  console.log("🚀 ~ videos ~ videos:", videos);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };
  return (
    <div className="mt-8 text-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-base text-[#D2D2D2] mb-6">{subTitle}</p>

        {/* Tabs */}
        {isTabEnabled && (
          <div className="flex space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-t-lg `}
                onClick={() => setActiveTab(tab)}
                style={{
                  background:
                    activeTab === tab
                      ? "linear-gradient(180deg, #6C6C6C 0%, #4B4B4B 100%)"
                      : "transparent",
                  borderRadius: activeTab === tab ? "100px" : "null",
                  border: activeTab === tab ? "1px solid #FFFFFF4D" : null,
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Masonry Grid - Simple CSS Solution */}
      {/* <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 ">
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
      </div> */}

      <div className="p-4">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {videos?.map((video, index) => (
            <div
              key={video.id}
              onClick={() => router.push(`/generate-video/${video?.id}`)}
              className="mb-4 break-inside-avoid overflow-hidden rounded-xl transition-transform  cursor-pointer relative"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              style={{ height: `${video.height}px` }}
            >
              {hoveredIndex === index ? (
                <video
                  src={video.videoUrl}
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <img
                  src={video.imageUrl}
                  alt={video.title}
                  className="w-full h-full object-cover rounded-xl"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                <h3 className="text-sm font-medium truncate">{video.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityCreatedContent;
