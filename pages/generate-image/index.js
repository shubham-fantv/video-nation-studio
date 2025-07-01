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
import LoadingScreen from "../../src/component/common/LoadingScreen";
import { usePlanModal } from "../../src/context/PlanModalContext";
import CustomWalletModal from "../../src/component/CustomWalletModal";
import { useDomainConfig } from '../../src/component/hooks/useDomainConfig';

const aspectRatioSizeMap = {
  "1:1": "w-4 h-4",
  "4:5": "w-10 h-12",
  "9:16": "w-3 h-4",
  "16:9": "w-4 h-3",
};

const index = () => {
  const CREDIT_AI_IMAGE = process.env.NEXT_PUBLIC_CREDIT_IMAGE_VALUE;
  const { isStudio, isApp, domain } = useDomainConfig();
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
  const [progressPercentage, setProgressPercentage] = useState(0);

  const aspectRatioData = ["16:9", "9:16", "1:1"];
  const [isLoading, setLoading] = useState(false);
  const [swalProps, setSwalProps] = useState({});
  const quoteIndexRef = useRef(0);
  const { isShowFreeTrialBanner, openUpgradeModal, openTrialModal, openNoCreditModal } =
    usePlanModal();

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
        sendEvent({
          event: "asset_generated",
          aspectRatio: aspectRatio,
          credits_used: 1,
          caption: captionEnabled,
          button_text: "Generate",
          page_name: "Generate Image",
          interaction_type: "Standard Button",
          type: "Image",
          url: response?.data?.finalImageUrl,
        });

        router.replace(`/generate-image/${response?.data._id}`, undefined, { scroll: false });
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
          preConfirm: () => {
            sendEvent({
              event: "button_clicked",
              button_text: "OK",
              page_name: "Generate Image",
              interaction_type: "Standard button",
              button_id: "popup_image_gen_error_btn",
              section_name: "Popup",
            });
          },
        });
        sendEvent({
          event: "popup_displayed",
          popup_type: "Error",
          popup_name: "Image Generation",
          popup_messge_text:
            "AI image generation service failed to respond. Please try again later",
          page_name: "Generate Image",
        });
      },
    }
  );

  const handleGenerateImage = () => {
    if (isLoggedIn) {
      if (!prompt.trim()) {
        alert("Please enter a prompt!");
        return;
      }
      if (userData.credits < CREDIT_AI_IMAGE) {
        if (isShowFreeTrialBanner) {
          openTrialModal();
        } else if (!userData.isFreeTrial && userData.isFreeTrialUsed) {
          openUpgradeModal();
        } else {
          openNoCreditModal();
        }
      } else {
        const requestBody = {
          prompt,
          imageInput: image ? [encodeURI(image)] : [],
          creditsUsed: 1,
          aspectRatio: aspectRatio,
          caption: captionEnabled,
          ...(image && { imageUrl: encodeURI(image) }), // ✅ encode URL with spaces
        };
        setLoading(true);
        generateImageApi(requestBody);
      }
    } else {
      setIsPopupVisible(true);
    }
  };

  useEffect(() => {
    if (!isLoading) return;

    let quoteInterval;
    let progressInterval;

    const pickRandomQuote = () => {
      setSubTitle(quotes[quoteIndexRef.current]);
      quoteIndexRef.current = (quoteIndexRef.current + 1) % quotes.length;
    };

    pickRandomQuote();
    setProgressPercentage(0);

    // Change quote every 5 seconds (or tweak if needed)
    quoteInterval = setInterval(() => {
      pickRandomQuote();
    }, 3000);

    // Simulate progress over 10 seconds
    const totalDuration = 10000; // 10 seconds
    const updateInterval = 200; // update every 200ms
    let elapsed = 0;

    progressInterval = setInterval(() => {
      elapsed += updateInterval;
      const progressRatio = elapsed / totalDuration;

      const easedProgress = Math.min(Math.floor(100 * Math.pow(progressRatio, 2.5)), 99);

      setProgressPercentage(easedProgress);

      if (elapsed >= totalDuration) {
        clearInterval(progressInterval);
        setProgressPercentage(100); // complete at the end
      }
    }, updateInterval);

    return () => {
      clearInterval(quoteInterval);
      clearInterval(progressInterval);
    };
  }, [isLoading]);

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

  return (
    <div>
      {isLoading && (
        <LoadingScreen
          progress={progressPercentage}
          mainText={subTitle}
          subText={`${progressPercentage}% completed`}
        />
      )}
      <div className="justify-center m-auto">
        <h1 className="text-black text-[32px] font-semibold text-center leading-[38px]">
          AI-Powered Image Creation. Just Type & Generate
        </h1>
        <p className="text-[#1E1E1EB2] pt-2 text-base font-normal text-center">
          Transform words into cinematic visuals — effortless, fast, and stunning.
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

          {/* Caption Toggle 
          <button
            onClick={() => setCaptionEnabled(!captionEnabled)}
            className="flex items-center gap-2 rounded-md bg-[#FFF] px-4 py-2 text-sm text-[#1E1E1E] shadow-md transition-all"
          >
            <div
              className={`w-6 h-4 flex items-center rounded-full p-[2px] transition-all ${
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
           Caption Toggle */}
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
            Credits : {CREDIT_AI_IMAGE}
            {Math.floor(userData?.credits) <= CREDIT_AI_IMAGE && (
              <div className="text-center">
                <small
                  className={
                    Math.floor(userData.credits) < CREDIT_AI_IMAGE
                      ? "text-red-600 font-semibold"
                      : "text-black"
                  }
                >
                  {/* {Math.max(1, Math.floor(userData.credits))} image
                  {Math.floor(userData.credits) === 1 ? "" : "s"} left */}
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
      <div className="flex flex-wrap gap-2 mt-4 overflow-auto">
        {samplePrompts.map((sample, idx) => (
          <button
            key={idx}
            onClick={() => {
              setPrompt(sample);
              sendEvent({
                event: "button_clicked",
                button_text: sample,
                page_name: "Generate Image",
                interaction_type: "Standard Button",
                button_id: "genimg_sample_prompt_btn",
              });
            }}
            className="w-[360px] h-[75px] rounded-full bg-[#F5F5F5] px-5 py-4 text-sm text-[#1E1E1E] shadow-sm hover:bg-gray-200 transition-all"
          >
            {sample}
          </button>
        ))}
      </div>
      <div className="mt-8"></div>
      {templates.length > 0 && (
        <div className="mt-12">
          <div className="w-full"></div>
        </div>
      )}

      {isStudio && isPopupVisible ? (
        <CustomWalletModal open={isPopupVisible} onClose={() => setIsPopupVisible(false)} />
      ) : (
        isPopupVisible && (
          <LoginAndSignup
            callBackName={"uniqueCommunity"}
            open={isPopupVisible}
            handleModalClose={() => setIsPopupVisible(false)}
          />
        )
      )}

      <SweetAlert2 {...swalProps} onConfirm={(handleConfirm) => setSwalProps({ show: false })} />
    </div>
  );
};

export default index;
