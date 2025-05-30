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
import { getPageName, quotes } from "../../src/utils/common";
import { allPromptSamples } from "../../src/utils/common";
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
  const lastTrialAction = localStorage.getItem("lastTrialAction");
  const RATE_LIMIT_INTERVAL_MS = 1 * 1000; // 1 sec for Image
  const [templates, setTemplates] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [subTitle, setSubTitle] = useState("");
  const router = useRouter();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [hfLora, setHfLora] = useState("");

  const [finalUrl, setFinalUrl] = useState();
  const [imageLoading, setImageLoading] = useState(false);

  const aspectRatioData = ["16:9", "9:16", "1:1"];
  const [isLoading, setLoading] = useState(false);
  const [swalProps, setSwalProps] = useState({});

  const getRandomPrompts = (list, count = 3) =>
    list
      .sort(() => 0.5 - Math.random()) // Shuffle
      .slice(0, count); // Pick first 3

  const [samplePrompts, setSamplePrompts] = useState([]);

  const magicPrompts = [
    "A dragon soaring over snow-covered mountains at dusk",
    "A glowing forest where fireflies light up the night",
    "A cyberpunk girl walking through a neon-lit alley",
    "A quiet Japanese teahouse on a rainy evening",
    "An astronaut relaxing on a tropical alien beach",
    // Add more here...
  ];

  const generateMagicPrompt = () => {
    const randomPrompt = magicPrompts[Math.floor(Math.random() * magicPrompts.length)];
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

      sendEvent({
        event: "button_clicked",
        button_text: "Ref Image",
        page_name: "Image Studio",
        interaction_type: "Attachment",
        status: "uploaded",
        button_id: "genimg_ref_img_btn",
      });
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  const { mutate: generateImageApi } = useMutation(
    (obj) =>
      fetcher.post(`http://20.244.81.100:8000/api/generate-text-to-image-new`, obj, {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MjhmMzUxMDYzNGUxNzEyODYzMTRlYzgiLCJpYXQiOjE2OTA5NzE4MDAsImV4cCI6MTc4NTY2NjE3MCwidHlwZSI6ImFjY2VzcyJ9.Zc_3_xYxkzqiW5r5eUGEgteNlqBphRqIHyBheR1AueY`,
      }),
    {
      onSuccess: (response) => {
        setLoading(false);
        setFinalUrl(response.data);
      },
      onError: (error) => {
        setLoading(false);
        const defaultMessage = "Something went wrong. Please try again later.";
        const message = error?.response?.data?.message || error?.message || defaultMessage;
        setSwalProps({
          key: Date.now(), // or use a counter
          icon: "error",
          show: true,
          title: "Error",
          text: message,
          confirmButtonText: "OK",
          preConfirm: () => {},
        });
      },
    }
  );

  const handleConfirm = () => {
    //console.log(response.data);
    //router.push("/my-library?tab=image");
  };

  const handleGenerateImage = () => {
    const requestBody = {
      text: prompt,
      aspectRatio: aspectRatio,
      hf_lora: hfLora,
    };
    setLoading(true);
    generateImageApi(requestBody);
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
    setSamplePrompts(getRandomPrompts(allPromptSamples));
  }, []);

  const textareaRef = useRef();

  useEffect(() => {
    textareaRef.current?.focus(); // Auto-focus on mount (for testing)
  }, []);

  const handleAspectRatio = (value) => {
    setAspectRatio(value);
    sendEvent({
      event: "button_clicked",
      button_text: "-",
      page_name: "Generate Image",
      interaction_type: "Dropdown Option Select",
      dropdown_name: "Aspect Ratio Selector",
      option_value: value,
      button_id: "genimg_aspect_ratio_dd_trigger",
    });
  };
  const handleDownloadImage = async () => {
    if (!finalUrl?.image) return;

    try {
      const response = await fetch(finalUrl.image);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${"image"}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  return (
    <div>
      {isLoading && <Loading title={"Please wait"} subTitle={subTitle} />}
      <div className="justify-center m-auto">
        <h1 className="text-black text-[32px] font-semibold text-center leading-[38px]">
          AI-Powered Image Creation. Just Type & Generate
        </h1>
        <p className="text-[#1E1E1EB2] pt-2 text-base font-normal text-center">
          Transform words into cinematic visuals — effortless, fast, and stunning.
        </p>
      </div>
      <div>
        <textarea
          ref={textareaRef}
          className="w-full rounded-md bg-[#F5F5F5] mt-5 p-3 text-sm text-[#1E1E1EB2] text-normal placeholder-gray-500 focus:outline-none"
          placeholder="Character Profile"
          rows={1}
          value={hfLora}
          onChange={(e) => setHfLora(e.target.value)}
        ></textarea>
      </div>
      <div className="flex mt-3 w-full flex-col gap-4 rounded-lg bg-[#F5F5F5] p-4 shadow-md">
        {/* Text Area */}
        <textarea
          ref={textareaRef}
          className="w-full rounded-md bg-[#F5F5F5] p-3 text-sm text-[#1E1E1EB2] text-normal placeholder-gray-500 focus:outline-none"
          placeholder="Enter your prompt..."
          rows={6}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        ></textarea>

        <div className="flex  flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 rounded-md bg-[#FFF] px-4 py-2 text-sm text-[1E1E1E] shadow-md transition-all">
            {/* <span className="w-4 h-3 border border-black rounded-sm"></span> */}
            <span
              className={`border border-black rounded-sm ${
                aspectRatioSizeMap[aspectRatio] || "w-4 h-3"
              }`}
            ></span>
            <select
              value={aspectRatio}
              onChange={(e) => handleAspectRatio(e.target.value)}
              className="bg-[#FFF]"
            >
              {aspectRatioData?.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </button>
          <div className="flex-1 hidden md:block"></div>
          {/* <button
            onClick={generateMagicPrompt}
            className="flex items-center gap-2 rounded-md bg-[#FFF] px-4 py-2 text-sm text-[#1E1E1E] shadow-md transition-all hover:bg-gray-100"
          >
            🪄 Magic Prompt
          </button> */}
          <div className="text-sm">
            Credits : 1
            {Math.floor(userData?.credits) < 6 && (
              <div className="text-center">
                <small
                  className={
                    Math.floor(userData.credits) < 2 ? "text-red-600 font-semibold" : "text-black"
                  }
                >
                  {Math.max(1, Math.floor(userData.credits))} image
                  {Math.floor(userData.credits) === 1 ? "" : "s"} left
                </small>
              </div>
            )}
          </div>
          <button
            onClick={() => handleGenerateImage()}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-2.5 text-white shadow-md transition-all hover:brightness-110"
          >
            Generate Image
          </button>
        </div>
      </div>

      {finalUrl?.image && (
        <div className="w-full p-4 md:p-4  px-4 md:px-[30px] py-4 md:py-[30px]">
          <div className="bg-[#FFFFFF0D] rounded-lg aspect-video flex items-center justify-center mb-4 m-auto max-h-[300px] md:max-h-[450px]">
            <div className="text-gray-500 w-full h-full">
              {/* Loader overlay */}
              {imageLoading && (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl z-10">
                  <span className="text-sm text-gray-400">Loading image...</span>
                </div>
              )}

              {/* Image always rendered */}
              <img
                src={finalUrl.image}
                key={finalUrl.image}
                alt={prompt}
                onLoad={() => setImageLoading(false)}
                className={`w-full h-full object-contain rounded-xl max-h-[300px] md:max-h-[450px] transition-opacity duration-500 ${
                  imageLoading ? "opacity-0" : "opacity-100"
                }`}
              />
            </div>
          </div>

          <div className="flex items-center justify-center flex-wrap gap-2 md:gap-4 mt-2">
            <button
              onClick={handleDownloadImage}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-4 md:px-6 py-2 md:py-3 text-white shadow-md transition-all hover:brightness-110 text-sm md:text-base"
            >
              ✨ Download
            </button>
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
      <SweetAlert2 {...swalProps} onConfirm={(handleConfirm) => setSwalProps({ show: false })} />
    </div>
  );
};

export default index;
