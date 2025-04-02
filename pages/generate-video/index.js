// import { Button } from "@mui/material";
// import React, { useState } from "react";
// import SectionCards from "../../src/component/SectionCards";
// import CommunityCreatedContent from "../../src/component/CommunityCreatedContent";
// import HowToCreate from "../../src/component/HowToCreate";
// import { useQuery } from "@tanstack/react-query";
// import fetcher from "../../src/dataProvider";
// import { FANTV_API_URL } from "../../src/constant/constants";

// const index = () => {
//   const [captionEnabled, setCaptionEnabled] = useState(false);
//   const [templates, setTemplates] = useState([]);

//   const { data, error, isLoading, refetch } = useQuery({
//     queryKey: ["seasonTask"],
//     queryFn: async () => {
//       const response = await fetcher.get(`${FANTV_API_URL}/templates?limit=30`);
//       setTemplates(response.data);
//       return response?.data;
//     },
//     refetchOnMount: "always",
//     onSuccess: (data) => {
//       console.log("🚀 ~ Index ~ data:", data);

//       setTemplates(data);
//     },
//     onError: (error) => {
//       console.error("🚀 ~ API Error:", error);
//     },
//   });

//   const handleGenerate = () => {};

//   return (
//     <div>
//       <div className="justify-center m-auto">
//         <h1 className="text-white text-[32px] font-semibold text-center leading-[38px]">
//           AI-Powered Video Creation. Just Type & Generate
//         </h1>
//         <p className="text-[#D2D2D2] pt-2 text-base font-normal text-center">
//           Transform words into cinematic visuals—effortless, fast, and stunning.
//         </p>
//       </div>
//       <div className="flex mt-8 w-full  flex-col gap-4 rounded-lg bg-[#292929] p-4 shadow-md">
//         {/* Text Area */}
//         <textarea
//           className="w-full rounded-md bg-transparent p-3  text-sm text-[#D2D2D2] text-normal placeholder-gray-500 focus:outline-none"
//           placeholder="Enter your prompt..."
//           rows={6}
//         >
//           A girl sipping coffee while travelling in the train
//         </textarea>

//         {/* Buttons & Toggle */}
//         <div className="flex items-center gap-3">
//           <button className="flex items-center gap-2 rounded-md bg-[#1E1E1E] px-4 py-2 text-sm text-[#D2D2D2] shadow-md transition-all hover:bg-gray-800">
//             + Add image
//           </button>

//           <button className="flex items-center gap-2 rounded-md bg-[#1E1E1E] px-4 py-2 text-sm text-[#D2D2D2] shadow-md transition-all hover:bg-gray-800">
//             <span className="w-4 h-3 border border-white rounded-sm"></span> 16:9
//           </button>

//           {/* Caption Toggle */}
//           <button
//             // onClick={() => setCaptionEnabled(!captionEnabled)}
//             className="flex items-center gap-2 rounded-md bg-[#1E1E1E] px-4 py-2 text-sm text-[#D2D2D2] shadow-md transition-all"
//           >
//             <div
//               className={`w-6 h-4 flex items-center rounded-full bg-gray-700 p-1 transition-all ${
//                 captionEnabled ? "bg-green-500" : "bg-gray-500"
//               }`}
//             >
//               <div
//                 className={`h-3 w-3 rounded-full bg-white transition-transform ${
//                   captionEnabled ? "translate-x-2" : ""
//                 }`}
//               ></div>
//             </div>
//             Caption
//           </button>

//           <div className="flex-1"></div>

//           <button
//             onClick={handleGenerate}
//             className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-2 text-white shadow-md transition-all hover:brightness-110"
//           >
//             ✨ Generate
//           </button>
//         </div>
//       </div>
//       <div>
//         <HowToCreate />
//       </div>
//       <div className="w-full">
//         <CommunityCreatedContent data={templates} isTabEnabled />
//       </div>
//     </div>
//   );
// };

// export default index;

import { Button } from "@mui/material";
import React, { useState } from "react";
import SectionCards from "../../src/component/SectionCards";
import CommunityCreatedContent from "../../src/component/CommunityCreatedContent";
import HowToCreate from "../../src/component/HowToCreate";
import { useMutation, useQuery } from "@tanstack/react-query";
import fetcher from "../../src/dataProvider";
import { FANTV_API_URL } from "../../src/constant/constants";
import axios from "axios";
import useGenerateVideo from "../../src/component/hooks/useGenerateVideo";

const index = () => {
  const [captionEnabled, setCaptionEnabled] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [_, generateVideoApi] = useGenerateVideo();

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["seasonTask"],
    queryFn: async () => {
      const response = await fetcher.get(`${FANTV_API_URL}/templates?limit=30`);
      setTemplates(response.data);
      return response?.data;
    },
    refetchOnMount: "always",
    onSuccess: (data) => {
      console.log("🚀 ~ Index ~ data:", data);
      setTemplates(data);
    },
    onError: (error) => {
      console.error("🚀 ~ API Error:", error);
    },
  });

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("https://upload.artistfirst.in/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("🚀 ~ handleImageUpload ~ response:", response);
      setImage(response?.data?.data?.[0]?.url);
      setImagePreview(URL.createObjectURL(file));
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
  };

  const handleGenerateVideo = () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt!");
      return;
    }

    const requestBody = {
      userId: "67e634cd3712275c56272853",
      prompt,
      imageInput: image ? [image] : [],
      creditsUsed: 20,
      aspectRatio: "16:9",
      caption: captionEnabled,
    };
    generateVideoApi(requestBody);
  };

  return (
    <div>
      <div className="justify-center m-auto">
        <h1 className="text-white text-[32px] font-semibold text-center leading-[38px]">
          AI-Powered Video Creation. Just Type & Generate
        </h1>
        <p className="text-[#D2D2D2] pt-2 text-base font-normal text-center">
          Transform words into cinematic visuals—effortless, fast, and stunning.
        </p>
      </div>
      <div className="flex mt-8 w-full flex-col gap-4 rounded-lg bg-[#292929] p-4 shadow-md">
        {/* Text Area */}
        <textarea
          className="w-full rounded-md bg-transparent p-3 text-sm text-[#D2D2D2] text-normal placeholder-gray-500 focus:outline-none"
          placeholder="Enter your prompt..."
          rows={6}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        ></textarea>

        {/* Image Preview */}
        {imagePreview && (
          <div className="relative w-24 h-24 mt-2">
            <img
              src={imagePreview}
              alt="Uploaded"
              className="w-full h-full object-cover rounded-md"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              ✖
            </button>
          </div>
        )}

        {/* Buttons & Toggle */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 rounded-md bg-[#1E1E1E] px-4 py-2 text-sm text-[#D2D2D2] shadow-md transition-all hover:bg-gray-800 cursor-pointer">
            + Add image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>

          <button className="flex items-center gap-2 rounded-md bg-[#1E1E1E] px-4 py-2 text-sm text-[#D2D2D2] shadow-md transition-all hover:bg-gray-800">
            <span className="w-4 h-3 border border-white rounded-sm"></span> 16:9
          </button>

          {/* Caption Toggle */}
          <button
            onClick={() => setCaptionEnabled(!captionEnabled)}
            className="flex items-center gap-2 rounded-md bg-[#1E1E1E] px-4 py-2 text-sm text-[#D2D2D2] shadow-md transition-all"
          >
            <div
              className={`w-6 h-4 flex items-center rounded-full bg-gray-700 p-1 transition-all ${
                captionEnabled ? "bg-green-500" : "bg-gray-500"
              }`}
            >
              <div
                className={`h-3 w-3 rounded-full bg-white transition-transform ${
                  captionEnabled ? "translate-x-2" : ""
                }`}
              ></div>
            </div>
            Caption
          </button>

          <div className="flex-1"></div>

          <button
            onClick={() => handleGenerateVideo()}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-2 text-white shadow-md transition-all hover:brightness-110"
          >
            ✨ Generate
          </button>
        </div>
      </div>
      <div>
        <HowToCreate />
      </div>
      <div className="w-full">
        <CommunityCreatedContent data={templates} isTabEnabled />
      </div>
    </div>
  );
};

export default index;
