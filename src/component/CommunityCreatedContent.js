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
}) => {
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

  return (
    <div className="mt-8 text-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-base text-[#D2D2D2] mb-6">{subTitle}</p>

        {/* Tabs */}
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
      </div>

      {/* Masonry Grid - Simple CSS Solution */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 ">
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
      </div>
    </div>
  );
};

export default CommunityCreatedContent;
