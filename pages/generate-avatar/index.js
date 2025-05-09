import { Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import SectionCards from "../../src/component/SectionCards";
import CommunityCreatedContent from "../../src/component/imageCommunityCreatedContent";
import HowToCreate from "../../src/component/HowToCreate";
import { useMutation, useQuery } from "react-query";
import fetcher from "../../src/dataProvider";
import { API_BASE_URL, FANTV_API_URL } from "../../src/constant/constants";
import axios from "axios";
import Loading from "../../src/component/common/Loading/loading";
import { quotes } from "../../src/utils/common";
import { allAvatarPromptSamples } from "../../src/utils/common";
import { useSelector } from "react-redux";
import LoginAndSignup from "../../src/component/feature/Login";
import { useRouter } from "next/router";
import SweetAlert2 from "react-sweetalert2";
import useGTM from "../../src/hooks/useGTM";

const aspectRatioSizeMap = {
  "1:1": "w-4 h-4",
  "4:5": "w-10 h-12",
  "9:16": "w-3 h-4",
  "16:9": "w-4 h-3",
};

const index = () => {
  const [captionEnabled, setCaptionEnabled] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [subTitle, setSubTitle] = useState("");
  const router = useRouter();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isPromptModalVisible, setIsPromptModalVisible] = useState(false);


  const aspectRatioData = ["16:9", "9:16", "1:1"];
  const [isLoading, setLoading] = useState(false);
  const [swalProps, setSwalProps] = useState({});

  const getRandomPrompts = (list, count = 3) =>
    list
      .sort(() => 0.5 - Math.random()) // Shuffle
      .slice(0, count); // Pick first 3
  
  const [samplePrompts, setSamplePrompts] = useState([]);

  const [form, setForm] = useState({
    age: "30",
    gender: "male",
    ethnicity: "Indian",
    hairColor: "black",
    eyeColor: "brown",
    clothing: "formal suit",
    expression: "confident",
    style: "cinematic portrait",
  });


  // Update prompt when form changes
  useEffect(() => {
    const { age, gender, ethnicity, hairColor, eyeColor, clothing, expression, style } = form;
    const generated = "Enter the prompt to create an AI Avatar"; 
    //const generated = `A ${age}-year-old ${gender} of ${ethnicity} descent with ${hairColor} hair and ${eyeColor} eyes, wearing a ${clothing} in a ${expression} expression, styled as a ${style}.`;
    setPrompt(generated);
  }, [form]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const magicPrompts = [
    "A dragon soaring over snow-covered mountains at dusk",
    "A glowing forest where fireflies light up the night",
    "A cyberpunk girl walking through a neon-lit alley",
    "A quiet Japanese teahouse on a rainy evening",
    "An astronaut relaxing on a tropical alien beach",
    // Add more here...
  ];
  
  const generateMagicPrompt = () => {
    const randomPrompt =
      magicPrompts[Math.floor(Math.random() * magicPrompts.length)];
    setPrompt(randomPrompt);
  };
  
  const { sendEvent } = useGTM();

  const { isLoggedIn, userData } = useSelector((state) => state.user);
  useQuery(
    `${FANTV_API_URL}/api/v1/templates?limit=30`,
    () => fetcher.get(`${FANTV_API_URL}/api/v1/templates?limit=30`),
    {
      refetchOnMount: "always",
      onSuccess: ({ data }) => {
        setTemplates(data.results);
      },
    }
  );

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

  const { mutate: generateImageApi } = useMutation(
    (obj) => fetcher.post(`${API_BASE_URL}/api/v1/ai-image`, obj),
    {
      onSuccess: (response) => {
        setImagePreview(null);
        setPrompt("");
        setLoading(false);
        setSwalProps({
          icon: "success",
          show: true,
          title: "Success",
          text: "Image generation is completed",
          showCancelButton: true,
          confirmButtonText: "Go to My Library",
          cancelButtonText: "Cancel",
          allowOutsideClick: false, // Optional: prevent dismiss by clicking outside
          allowEscapeKey: false, // Optional: prevent ESC close
        });
      },
      onError: (error) => {
        setLoading(false);
      
        const defaultMessage = "Something went wrong. Please try again later.";
      
        const message =
          error?.response?.data?.message ||
          error?.message ||
          defaultMessage;
      
        setSwalProps({
          icon: "error",
          show: true,
          title: "Error",
          text: message,
          confirmButtonText: "OK",
        });
      },
    }
  );

  const handleConfirm = () => {
    router.push("/my-library?tab=image");
  };

  const handleGenerateImage = () => {
    if (isLoggedIn) {
      if (!prompt.trim()) {
        alert("Please enter a prompt!");
        return;
      }

      if (userData.credits <= 0) {
        router.push("/subscription");
        return;
      }

      const requestBody = {
        prompt,
        imageInput: image ? [image] : [],
        creditsUsed: 1,
        aspectRatio: aspectRatio,
        caption: captionEnabled,
        ...(image && { imageUrl: image }), // ✅ only include if `image` is truthy
      };
      setLoading(true);

      sendEvent({
        event: "Generate Image",
        email: userData?.email,
        name: userData?.name,
        prompt: prompt,
        aspectRatio: aspectRatio,
        caption: captionEnabled,
      });

      generateImageApi(requestBody);
    } else {
      setIsPopupVisible(true);
    }
  };

  useEffect(() => {
    const pickRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setSubTitle(quotes[randomIndex]);
    };
    pickRandomQuote();
    const interval = setInterval(pickRandomQuote, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    //setSamplePrompts(getRandomPrompts(allAvatarPromptSamples));
  }, []);

  const textareaRef = useRef();

  useEffect(() => {
    textareaRef.current?.focus(); // Auto-focus on mount (for testing)
  }, []);

  return (
    <div>
      {isLoading && <Loading title={"Please wait"} subTitle={subTitle} />}
      <div className="justify-center m-auto">
        <h1 className="text-black text-[32px] font-semibold text-center leading-[38px]">
          AI-Powered Avatar Creation
        </h1>
        <p className="text-[#1E1E1EB2] pt-2 text-base font-normal text-center">
          
        </p>
      </div>

      <div className="flex mt-8 w-full flex-col gap-4 rounded-lg bg-[#F5F5F5] p-4 shadow-md">
        {/* Text Area */}
        <textarea
          ref={textareaRef}
          className="w-full rounded-md bg-[#F5F5F5] p-3 text-sm text-[#1E1E1EB2] text-normal placeholder-gray-500 focus:outline-none"
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
              className="absolute top-0 right-0 bg-red-600 text-black rounded-full w-6 h-6 flex items-center justify-center"
            >
              ✖
            </button>
          </div>
        )}

        {/* Buttons & Toggle */}
        <div className="flex  flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 rounded-md bg-[#FFF] px-4 py-2 text-sm text-[#1E1E1E] shadow-md transition-all cursor-pointer">
            + Ref image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>

          <button className="flex items-center gap-2 rounded-md bg-[#FFF] px-4 py-2 text-sm text-[1E1E1E] shadow-md transition-all">
            {/* <span className="w-4 h-3 border border-black rounded-sm"></span> */}
            <span
              className={`border border-black rounded-sm ${
                aspectRatioSizeMap[aspectRatio] || "w-4 h-3"
              }`}
            ></span>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="bg-[#FFF]"
            >
              {aspectRatioData?.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </button>
          <div className="flex-1 hidden md:block"></div>
          <button
  onClick={() => setIsPromptModalVisible(true)}
  className="flex items-center gap-2 rounded-md bg-[#FFF] px-4 py-2 text-sm text-[#1E1E1E] shadow-md transition-all hover:bg-gray-100"
>
  🪄 Create Avatar Prompt
</button>

          <button
            onClick={() => handleGenerateImage()}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-2 text-white shadow-md transition-all hover:brightness-110"
          >
            ✨ Generate
          </button>
        </div>
        
      </div>
       <div className="flex flex-wrap gap-2 mt-4 overflow-auto">
          {samplePrompts.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => setPrompt(sample)}
              className="w-[360px] h-[75px] rounded-full bg-[#F5F5F5] px-5 py-4 text-sm text-[#1E1E1E] shadow-sm hover:bg-gray-200 transition-all"
            >
              {sample}
            </button>
          ))}
        </div>

      {templates.length > 0 && (
        <div className="mt-12">
          <div className="w-full">
            <CommunityCreatedContent data={templates} isTabEnabled />
          </div>
        </div>
      )}

      {isPopupVisible && (
        <LoginAndSignup
          callBackName={"uniqueCommunity"}
          open={isPopupVisible}
          handleModalClose={() => setIsPopupVisible(false)}
        />
      )}
      <SweetAlert2 {...swalProps} onConfirm={handleConfirm} />
    
      {isPromptModalVisible && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white w-full max-w-5xl rounded-xl p-6 relative">
      <button
        onClick={() => setIsPromptModalVisible(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-black text-lg"
      >
        ✕
      </button>

      <h2 className="text-xl font-semibold mb-6">Create Avatar Prompt</h2>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm text-gray-700 font-medium mb-4">
        {[
          ["Age", "age", "number"],
          ["Gender", "gender", "select"],
          ["Ethnicity", "ethnicity", "text"],
          ["Hair Color", "hairColor", "text"],
          ["Eye Color", "eyeColor", "text"],
          ["Clothing", "clothing", "text"],
          ["Expression", "expression", "text"],
          ["Avatar Style", "style", "text"],
        ].map(([label, name, type]) => (
          <div key={name} className="flex flex-col">
            <label htmlFor={name}>{label}</label>
            {type === "select" ? (
              <select
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="border p-2 rounded-md"
              >
                <option value="male">male</option>
                <option value="female">female</option>
                <option value="non-binary">non-binary</option>
              </select>
            ) : (
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="border p-2 rounded-md"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setIsPromptModalVisible(false)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            const {
                age,
                gender,
                ethnicity,
                hairColor,
                eyeColor,
                clothing,
                expression,
                style,
              } = form;
              
              const promptParts = [
                age ? `${age}-year-old` : "",
                gender,
                ethnicity ? `of ${ethnicity} descent` : "",
                hairColor || eyeColor ? `with ${hairColor ? hairColor + " hair" : ""}${hairColor && eyeColor ? " and " : ""}${eyeColor ? eyeColor + " eyes" : ""}` : "",
                clothing ? `wearing a ${clothing}` : "",
                expression ? `in a ${expression} expression` : "",
                style ? `styled as a ${style}` : "",
              ];
              
              const generated = promptParts.filter(Boolean).join(", ") + ".";
              setPrompt(generated.trim());
              setIsPromptModalVisible(false);
          }}
          className="px-4 py-2 bg-black text-white rounded-md"
        >
          Use Prompt
        </button>
      </div>
    </div>
  </div>
)}
    
    
    </div>
  );
};

export default index;
