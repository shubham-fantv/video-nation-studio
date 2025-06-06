import { Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import SectionCards from "../../src/component/SectionCards";
import CommunityCreatedContent from "../../src/component/CommunityCreatedContent";
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
  const [selectedVoice, setSelectedVoice] = useState(null);
  const lastTrialAction = localStorage.getItem("lastTrialAction");
  const RATE_LIMIT_INTERVAL_MS = 12 * 60 * 60 * 1000; // 12 hours
  const [isPlaying, setIsPlaying] = useState(null);
  const [showVoiceDropdown, setShowVoiceDropdown] = useState(false);
  const quoteIndexRef = useRef(0);

  const audioRef = useRef(null); // reference for controlling audio
  const voiceOptions = [
    {
      name: "Laura",
      value: "6ZeRQ71MhGGmKDjCiFRa",
      sampleUrl:
        "https://assets.artistfirst.in/uploads/1747488017829-voice_preview_laura%20-%20narrative.mp3",
    },
    {
      name: "John",
      value: "c4NIULtANlpduSDihsKJ",
      sampleUrl:
        "https://assets.artistfirst.in/uploads/1747488078180-voice_preview_john_storyteller.mp3",
    },
    {
      name: "Clara",
      value: "8LVfoRdkh4zgjr8v5ObE",
      sampleUrl:
        "https://assets.artistfirst.in/uploads/1747488113955-voice_preview_clarastoryteller.mp3",
    },
    {
      name: "Monika",
      value: "2bNrEsM0omyhLiEyOwqY",
      sampleUrl:
        "https://assets.artistfirst.in/uploads/1747488171032-voice_preview_monika%20sogam-friendly%20customer%20care%20agent.mp3",
    },
    {
      name: "Arjun",
      value: "dxhwlBCxCrnzRlP4wDeE",
      sampleUrl: "https://assets.artistfirst.in/uploads/1747488220089-voice_preview_arjun.mp3",
    },
  ];
  const [selectedCaptionStyle, setSelectedCaptionStyle] = useState(null);
  const [showCaptionDropdown, setShowCaptionDropdown] = useState(false);
  const captionOptions = [
    { label: "Classic White", value: "ClassicWhite", img: "/images/caption-white.png" },
    { label: "Yellow Border", value: "YellowBorder", img: "/images/fantasy-purple.png" },
    { label: "Top Italic", value: "TopItalic", img: "/images/caption-previews/top_italic.png" },
    { label: "Big Red", value: "BigRedImpact", img: "/images/caption-previews/big_red_impact.png" },
    {
      label: "Fantasy Purple",
      value: "FantasyPurple",
      img: "/images/caption-previews/fantasy_purple.png",
    },
  ];

  const [templates, setTemplates] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [finalVideo, setFinalVideo] = useState("");
  const [image, setImage] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [credits, setCredits] = useState(20);
  const [duration, setDuration] = useState("5 sec");
  const [subTitle, setSubTitle] = useState("");
  const router = useRouter();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);

  const aspectRatioData = ["16:9", "9:16", "1:1"];
  const durationData = ["5 sec", "15 sec"];
  const [isLoading, setLoading] = useState(false);
  const [swalProps, setSwalProps] = useState({});

  const getRandomPrompts = (list, count = 3) =>
    list
      .sort(() => 0.5 - Math.random()) // Shuffle
      .slice(0, count); // Pick first 3

  const [samplePrompts, setSamplePrompts] = useState([]);

  const { sendEvent } = useGTM();

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
        page_name: "Video Studio",
        interaction_type: "Attachment",
        button_id: "genvid_ref_img_btn",
        voiceover: selectedVoice || "No Voice",
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

  const { mutate: generateVideoApi } = useMutation(
    (obj) => fetcher.post(`http://20.244.81.100:8000/api/generate-text-to-video-new`, obj),
    {
      onSuccess: (response) => {
        setImagePreview(null);
        setFinalVideo(response?.data);
        setLoading(false);
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

  const handleGenerateVideo = () => {
    const requestBody = {
      text: prompt,
      aspectRatio: aspectRatio,
      length: 5,
      cfgScale: 1,
      startImage: image,
      negativePrompt: "",
    };
    setLoading(true);
    generateVideoApi(requestBody);
  };

  useEffect(() => {
    if (!isLoading) return;

    let quoteInterval;
    let progressInterval;

    const pickRandomQuote = () => {
      setSubTitle(quotes[quoteIndexRef.current]);
      quoteIndexRef.current = (quoteIndexRef.current + 1) % quotes.length; // cycle
    };
    // Initial call
    pickRandomQuote();
    setProgressPercentage(0);

    // Change quote every 15 seconds
    quoteInterval = setInterval(() => {
      pickRandomQuote();
    }, 15000);

    // Simulate progress over ~3 minutes
    const totalDuration = 180000; // 3 minutes
    const updateInterval = 2000; // every 2 seconds
    let elapsed = 0;

    progressInterval = setInterval(() => {
      elapsed += updateInterval;
      const progressRatio = elapsed / totalDuration;

      const easedProgress = Math.min(
        Math.floor(100 * Math.pow(progressRatio, 2.5)), // exponent controls acceleration
        99
      );

      const progress = Math.min(Math.floor((elapsed / totalDuration) * 100), 99); // max 99%
      setProgressPercentage(easedProgress);
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

  const handleDownloadVideo = async () => {
    if (!finalVideo?.video) return;
    try {
      const response = await fetch(finalVideo?.video);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "video.mp4";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download video:", error);
    }
  };

  return (
    <div>
      {isLoading && (
        <Loading title={`Generating your video... (${progressPercentage}%)`} subTitle={subTitle} />
      )}
      <div className="justify-center m-auto">
        <h1 className="text-black text-[32px] font-semibold text-center leading-[38px]">
          AI-Powered Video Creation. Just Type & Generate
        </h1>
        <p className="text-[#1E1E1EB2] pt-2 text-base font-normal text-center">
          Transform words into cinematic visuals—effortless, fast, and stunning
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
              onChange={(e) => {
                setAspectRatio(e.target.value);
                sendEvent({
                  event: "button_clicked",
                  page_name: "Generate Video",
                  interaction_type: "Dropdown Option Select",
                  button_id: "genvid_aspect_ratio_dd_trigger",
                  dropdown_name: "Aspect Ratio Selector",
                  option_value: e.target.value,
                });
              }}
              className="bg-[#FFF]"
            >
              {aspectRatioData?.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </button>
          {/* Duration Dropdown */}
          <button className="flex items-center gap-2 rounded-md bg-[#FFF] px-4 py-2 text-sm text-[1E1E1E] shadow-md transition-all">
            {/* <span className="w-4 h-3 border border-black rounded-sm"></span> */}
            <select
              value={duration}
              onChange={(e) => {
                setDuration(e.target.value);
                setCredits(20 * parseInt(e.target.value.replace("sec", "").trim() / 5, 10));
                sendEvent({
                  event: "button_clicked",
                  button_text: "-",
                  page_name: "Generate Video",
                  interaction_type: "Dropdown Option Select",
                  button_id: "genvid_duration_dd_trigger",
                  dropdown_name: "Duration Selector",
                  option_value: e.target.value,
                });
              }}
              className="bg-[#FFF]"
            >
              {durationData?.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </button>

          <button
            onClick={() => handleGenerateVideo()}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-2.5 text-white shadow-md transition-all hover:brightness-110"
          >
            Generate Video
          </button>
        </div>
      </div>
      <div>
        {finalVideo?.video && (
          <div className="w-full p-4 md:p-4 px-4 md:px-[30px] py-4 md:py-[30px]">
            <div className="bg-[#FFFFFF0D] rounded-lg aspect-video flex items-center justify-center mb-4 m-auto max-h-[300px] md:max-h-[450px]">
              <div className="text-gray-500 w-full h-full">
                <video
                  src={finalVideo?.video}
                  muted
                  loop
                  playsInline
                  controls
                  onMouseEnter={(e) => e.target.play()}
                  onMouseLeave={(e) => e.target.pause()}
                  onEnded={(e) => e.target.play()}
                  className="w-full h-full object-contain rounded-xl max-h-[300px] md:max-h-[450px]"
                />
              </div>
            </div>

            <div className="flex items-center justify-center flex-wrap gap-2 md:gap-4 mt-2">
              <button
                onClick={handleDownloadVideo}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-4 md:px-6 py-2 md:py-3 text-white shadow-md transition-all hover:brightness-110 text-sm md:text-base"
              >
                ✨ Download
              </button>
            </div>
          </div>
        )}
      </div>
      <SweetAlert2 {...swalProps} onConfirm={(handleConfirm) => setSwalProps({ show: false })} />
    </div>
  );
};

export default index;
